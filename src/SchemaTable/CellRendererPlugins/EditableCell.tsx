import React, { useState, useEffect } from "react";
import { Input } from "@chakra-ui/react";
import { ParsePropUpdater } from "../PropUpdater";
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from "./ToggleEditWrapper";
import { PluginTypes } from '../types';

// Create an editable cell renderer
export const EditableCell = (props) => {
  const {
    column: {
      columnDef: {
        rowEditable,
        setRowEditable,
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

  const initialValue = getValue();
  const { id } = column;

  const [local, setLocal] = useState(initialValue);

  const handleChange = (e: { target: { value: string } }) => {
    setLocal(e.target.value)
  }

  useEffect(() => {
    setLocal(initialValue)
  }, [initialValue]);

  return (
    <ToggleEditWrapper
      width={'100%'}
      textAlign={textAlign || 'center'}
      value={initialValue}
      editable={editable}
    >
      <ParsePropUpdater object={original} property={id}>
        {({ onChange, value, isLoading }) => {
          const onBlur = () => {
            if (local !== value) {
              onChange(local);
            }
          }

          useEffect(() => {
            setLocal(value)
          }, [value])

          return (
            <>
              <Input
                isDisabled={!editable || isLoading}
                borderRadius={0}
                borderColor="transparent"
                value={local}
                onChange={handleChange}
                onBlur={onBlur}
                background={'transparent'}
                textAlign={textAlign || 'center'}
                padding={'0'}
                margin={'0'}
                height={'45px'}
                fontSize={'sm'}
              />
              {discussion && <DiscussionButton
                type='icon'
                object={original}
                context={id}
                title={discussionTitle && discussionTitle(original)}
              />}
            </>
          )
        }}
      </ParsePropUpdater>
    </ToggleEditWrapper>
  )
}

export default {
  name: 'EditableCell',
  type: PluginTypes.CellRenderer,
  component: EditableCell
}
