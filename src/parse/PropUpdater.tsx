import Parse from 'parse/dist/parse.min.js';
import { ClassNames } from "@app/shared/types";
import { Attribute } from "@app/shared/parse-types";
import ClassSearchSelect from '../components/Selectors/ClassSearchSelect';

import React, { ReactNode, useState, useEffect, useRef } from 'react';

import getters from '@app/shared/utils/getters'

import {
  useToast,
  Text,
  Link,
} from "@chakra-ui/react";

interface FuncArgs {
  onChange: (value: any) => void,
  value: any,
}

type FunctionChild = (args: FuncArgs) => React.ReactNode;

interface ParsePropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  children: FunctionChild;
}

export const ParsePropUpdater = (props: ParsePropUpdaterProps): ReactNode => {
  const { object, property, children } = props;
  const toast = useToast();
  const [value, setValue] = useState<Date | undefined>(object.get(property));
  const [prevValue, setPrevValue] = useState<any | undefined>(value);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = (v: Date, isUndo?: boolean) => {
    setIsLoading(true);
    setValue(v);
    object.set(property, v);
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
      });
      setPrevValue(v);
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
    console.log(prevValue);
    if (prevValue) {
      handleUpdate(prevValue, true);
    }
  }

  return children({
    onChange: handleUpdate,
    value,
  })
}

interface ParseFilePropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  children: FunctionChild;
}

export const ParseFilePropUpdater = (props: ParsePropUpdaterProps): ReactNode => {
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
        PrevValueRef.current = object.get(property);
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
  })
}

interface ParsePropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  objectClass: ClassNames;
  attributeName: string;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isMulti?: boolean;
  isClearable?: boolean;
}

export const RelationPropUpdater = (props: ParsePropUpdaterProps): ReactNode => {
  const toast = useToast();
  const getter = getters(props.objectClass);
  const { object, property, isClearable, objectClass, valueGetter, labelGetter } = props;
  const [initialData, setInitialData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const valueRef = React.useRef<any>();
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    object?.get(property).query().find()
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
    console.log('handleUpdate', value);
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
      // title: (
      //   <Text fontSize="sm">
      //     {`${property} updated`} - <Link onClick={() => handleUndo('update')}>Undo</Link>
      //   </Text>
      // ),
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  const handleClear = async () => {
    console.log('handleClear');
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
    console.log('handleRemove', objectId);
    setIsLoading(true);
    const options = await object.relation(property).query().find();
    const removed = options.filter((o: Attribute) => o.id === objectId);
    valueRef.current = removed;
    object.relation(property).remove(removed);
    console.log(valueRef.current);
    await object.save();
    await updateInitialData();
    setIsLoading(false);
    toast({
      title: `Item removed`,
      // title: (
      //   <Text fontSize="sm">
      //     {`${property} removed`} - <Link onClick={() => handleUndo('remove')}>Undo</Link>
      //   </Text>
      // ),
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  const handleCreate = async (relation: Parse.Object<any>) => {
    console.log('handleCreate', relation);
    setIsLoading(true);
    object.relation(property).add(relation);
    await object.save();
    await updateInitialData();
    setIsLoading(false);
    toast({
      title: `Item created`,
      // title: (
      //   <Text fontSize="sm">
      //     {`${property} removed`} - <Link onClick={() => handleUndo('remove')}>Undo</Link>
      //   </Text>
      // ),
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  console.log(initialData);

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
      <ClassSearchSelect
        isClearable={isClearable}
        isLoading={isLoading}
        disabled={isLoading}
        style={{ width: '100%' }}
        objectClass={objectClass}
        initialValue={initialData}
        valueGetter={valueGetter}
        labelGetter={labelGetter}
        onSelect={handleUpdate}
        onCreate={handleCreate}
        onRemove={handleRemove}
        onClear={handleClear}
        isCreateable
        queryName={objectClass}
        isMulti
      />
    </div>
  )
}