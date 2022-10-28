import Parse from 'parse/dist/parse.min.js';
import React, { useState, useEffect } from "react";
import { ClassNames } from "@app/shared/types";
import { Attribute } from "@app/shared/parse-types";

import ClassSearchSelect from '../../components/Selectors/ClassSearchSelect';
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from './ToggleEditWrapper';
import { PluginTypes } from '../types';

export interface EditableAttributeCellProps {
  attributeName: string;
  objectClass: ClassNames;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isMulti?: boolean;
  isClearable?: boolean;
  editable?: boolean;
}

export const EditableAttributeCell = ({
  attributeName,
  objectClass,
  valueGetter,
  labelGetter,
  isMulti,
  isClearable,
}: EditableAttributeCellProps) => (props) => {
  const {
    column: {
      columnDef: {
        editable,
        textAlign,
        discussion,
        discussionTitle,
      }
    },
    row,
    cell: {
      getValue,
    },
    row: { original },
    column, // This is a custom function that we supplied to our table instance
  } = props;

  const { id } = column;
  const initialValue = getValue();
  const [initialData, setInitialData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (isMulti && initialValue) {
      setInitialData(initialValue);
      // setIsLoading(true);
      // initialValue?.query().find()
      //   .then((result: any) => {
      //     setIsLoading(false);
      //     setError(undefined);
      //     if (result) {
      //       setInitialData(result.map((r: Parse.Object<any>) => r.toJSON()));
      //     }
      //   })
      //   .catch((err: any) => {
      //     setIsLoading(false);
      //     setError(err);
      //   })
    } else {
      const iv = initialValue;
      if (iv) {
        setInitialData(iv);
      }
    }
  }, [isMulti, initialValue]);

  const handleUpdate = async (value: any) => {
    console.log('handleUpdate', value);
    const object: Attribute = original;
    setIsLoading(true);
    if (isMulti) {
      if (value[0] !== undefined) {
        object.relation(id).add(value);
      }
    } else {
      object.set(id, value);
    }
    await object.save();
    setIsLoading(false);
  }

  const handleClear = async () => {
    console.log('handleClear');
    const object = original;
    setIsLoading(true);
    if (isMulti) {
      const items = await object.relation(id).query().find();
      items.forEach((item: Attribute) => {
        object.relation(id).remove(item);
      });
    } else {
      object.set(id, null);
    }
    await object.save();
    setIsLoading(false);
    setInitialData(undefined);
  }

  const handleRemove = async (objectId: string) => {
    // console.log('handleRemove', objectId);
    const object = original;
    setIsLoading(true);
    const options = await object.relation(id).query().find();
    const removed = options.filter((o: Attribute) => o.id === objectId);
    object.relation(id).remove(removed);
    await object.save();
    setIsLoading(false);
  }

  const handleCreate = async (value: string) => {
    console.log({ operation: 'handleCreate', value, isMulti });
    const object = original;
    setIsLoading(true);
    if (isMulti) {
      object.relation(id).add(value);
    } else {
      object.set(id, value);
    }
    await object.save();

    if (isMulti) {
      const options = await object.relation(id).query().find();
      setInitialData(options.map((r: Parse.Object<any>) => r.toJSON()));
    } else {
      setInitialData(value?.toJSON());
    }

    setIsLoading(false);
    return value;
  }

  return (
    <ToggleEditWrapper
      width={'100%'}
      textAlign={textAlign || 'center'}
      value={isMulti ? initialData?.map((data: any) => labelGetter(data)).join(', ') : (initialData) ? labelGetter(initialData) : ''}
      editable={editable}
    >
      <>
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
            isMulti={isMulti}
            filters={[
              {
                prop: 'name',
                method: 'equalTo',
                value: attributeName,
              }
            ]}
          />
        </div>
        {discussion && (
          <DiscussionButton
            type='icon'
            object={original}
            context={id}
            title={discussionTitle && discussionTitle(original)}
          />
        )}
      </>
    </ToggleEditWrapper>
  )
}

export default {
  name: 'EditableAttributeCell',
  type: PluginTypes.CellRenderer,
  component: EditableAttributeCell
}