import Parse from 'parse/dist/parse.min.js';
import { ClassNames } from "@app/shared/types";
import { Attribute } from "@app/shared/parse-types";
import ClassSearchSelect from '../components/Selectors/ClassSearchSelect';

import React, { ReactElement, useState, useEffect, useRef } from 'react';

import getters from '@app/shared/utils/getters'

import {
  useToast,
  Text,
  Link,
  FormLabel,
  Box,
} from "@chakra-ui/react";

import { useColorPalette } from '@app/theme';

interface FuncArgs {
  onChange: (value: any) => void;
  value: any;
  isLoading: boolean;
}

type FunctionChild = (args: FuncArgs) => React.ReactElement;

interface ParsePropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  subProperty?: string;
  children: FunctionChild;
}

export const ParsePropUpdater = (props: ParsePropUpdaterProps): ReactElement => {
  const { object, property, subProperty, children } = props;
  const toast = useToast();

  const propertyValue = object.get(property);
  const subPropertyValue = propertyValue ? propertyValue[subProperty] : null;

  const [value, setValue] = useState<any | undefined>((subProperty) ? subPropertyValue : propertyValue);
  const [prevValue, setPrevValue] = useState<any | undefined>(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (v: any, isUndo?: boolean) => {
    setIsLoading(true);
    setValue(v);
    if (subProperty) {
      await object.fetch();
      const newPropertyValue = { ...object.get(property) };
      newPropertyValue[subProperty] = v;
      object.set(property, newPropertyValue);
    } else {
      object.set(property, v);
    }
    object.save().then(() => {
      setIsLoading(false);
      toast({
        title: isUndo
          ? (
            <Text fontSize="sm">
              {`${property} successully reverted.`}
            </Text>
          )
          : (
            <Text fontSize="sm">
              {`${property} updated`} - <Link onClick={handleUndo}>Undo</Link>
            </Text>
          ),
        status: isUndo ? "info" : "success",
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => {
          setPrevValue(v);
        }
      });
    }).catch((e) => {
      setIsLoading(false);
      toast({
        title: `ERROR: ${e.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }

  const handleUndo = () => {
    if (prevValue) {
      handleUpdate(prevValue, true);
    }
  }

  return children({
    onChange: handleUpdate,
    value,
    isLoading,
  })
}

interface ParseFilePropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  children: FunctionChild;
}

export const ParseFilePropUpdater = (props: ParsePropUpdaterProps): ReactElement => {
  const { object, property, children } = props;
  const toast = useToast();
  const [value, setValue] = useState<Parse.File | undefined>(object.get(property));
  const PrevValueRef = useRef<any | undefined>(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (f: File, isUndo?: boolean) => {
    try {
      setIsLoading(true);
      if (isUndo) {
        object.set(property, PrevValueRef.current);
        setValue(PrevValueRef.current);
      } else {
        const newFile = new Parse.File(`${object.id}_avatar.jpg`, f);
        await newFile.save();
        setValue(newFile);
        object.set(property, newFile);
      }
      await object.save()
      setIsLoading(false);
      toast({
        title: isUndo
          ? (
            <Text fontSize="sm">
              {`${property} successully reverted.`}
            </Text>
          )
          : (
            <Text fontSize="sm">
              {`${property} updated`} - <Link onClick={handleUndo}>Undo</Link>
            </Text>
          ),
        status: isUndo ? "info" : "success",
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => {
          PrevValueRef.current = object.get(property);
        }
      });
    } catch (e) {
      setIsLoading(false);
      toast({
        title: `ERROR: ${e.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleUndo = () => {
    if (PrevValueRef.current) {
      handleUpdate(PrevValueRef.current, true);
    }
  }

  return children({
    onChange: handleUpdate,
    value,
    isLoading,
  })
}

interface ParsePropUpdaterProps {
  label?: string;
  object: Parse.Object<any>;
  property: string;
  objectClass: ClassNames;
  attributeName: string;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isMulti?: boolean;
  isClearable?: boolean;
}

export const RelationPropUpdater = (props: ParsePropUpdaterProps): ReactElement => {
  const { textColor } = useColorPalette();
  const toast = useToast();
  const { valueGetter, labelGetter } = getters(props.objectClass);
  const { label, object, property, objectClass, ...rest } = props;
  const [initialData, setInitialData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const valueRef = React.useRef<any>();
  const [error, setError] = useState();

  useEffect(() => {
    const relation = object?.get(property);
    console.log(relation);
    if (!relation) return;
    setIsLoading(true);
    relation.query().find()
      .then((result: any) => {
        setIsLoading(false);
        setError(undefined);
        if (result) {
          setInitialData(result.map((r: Parse.Object<any>) => r.toJSON()));
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        setError(err);
        toast({
          title: `ERROR: ${err.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
  }, []);

  const updateInitialData = async () => {
    const options = await object.relation(property).query().find();
    setInitialData(options.map((r: Parse.Object<any>) => r.toJSON()));
  }

  const handleUndo = async (op: string) => {
    console.log('handleUndo', op, valueRef.current);
    if (valueRef.current) {
      setIsLoading(true);
      const relation = object.get(property);
      if (op === 'add') {
        await relation.remove(valueRef.current);
      } else if (op === 'remove') {
        await relation.add(valueRef.current);
      }
      await object.save();
      setIsLoading(false);
      toast({
        title: `${property} reverted.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      valueRef.current = undefined;
      await updateInitialData();
    }
  }

  const handleUpdate = async (value: any) => {
    valueRef.current = value;
    setIsLoading(true);
    if (value[0] !== undefined) {
      object.relation(property).add(value);
    }
    await object.save();
    await updateInitialData();
    setIsLoading(false);
    toast({
      title: `Item updated`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  const handleClear = async () => {
    setIsLoading(true);
    const relations = await object.relation(property).query().find();
    relations.forEach((relation: Parse.Object<any>) => {
      object.relation(property).remove(relation);
    });
    await object.save();
    setIsLoading(false);
    setInitialData(undefined);
  }

  const handleRemove = async (objectId: string) => {
    setIsLoading(true);
    const options = await object.relation(property).query().find();
    const removed = options.filter((o: Attribute) => o.id === objectId);
    valueRef.current = removed;
    object.relation(property).remove(removed);
    await object.save();
    await updateInitialData();
    setIsLoading(false);
    toast({
      title: `Item removed`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  const handleCreate = async (relation: Parse.Object<any>) => {
    setIsLoading(true);
    object.relation(property).add(relation);
    await object.save();
    await updateInitialData();
    setIsLoading(false);
    toast({
      title: `Item created`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Box position={'relative'} width={'100%'} zIndex={1000}>
      {label && (
        <FormLabel
          color={textColor}
          fontWeight="bold"
          fontSize="xs"
        >
          {label}
        </FormLabel>
      )}
      <ClassSearchSelect
        isLoading={isLoading}
        disabled={isLoading}
        objectClass={objectClass}
        queryName={objectClass}
        initialValue={initialData}
        valueGetter={valueGetter}
        labelGetter={labelGetter}
        onSelect={handleUpdate}
        onCreate={handleCreate}
        onRemove={handleRemove}
        onClear={handleClear}
        {...rest}
      />
    </Box>
  )
}