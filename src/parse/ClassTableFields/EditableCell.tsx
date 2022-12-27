import React, { useState, useEffect } from "react";
import { Input } from "@chakra-ui/react";
import { ParsePropUpdater } from "../PropUpdater";
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from "./ToggleEditWrapper";

// Create an editable cell renderer
export const EditableCell = (props) => {
  const {
    rowEditable,
    setRowEditable,
    value: initialValue,
    row: { original },
    column, // This is a custom function that we supplied to our table instance
  } = props;

  const { id, editable, textAlign, discussion, discussionTitle } = column;
  const [local, setLocal] = useState(initialValue);

  const handleChange = (e: { target: { value: string } }) => {
    setLocal(e.target.value)
  }

  useEffect(() => {
    setLocal(initialValue)
  }, [initialValue]);

  if (!rowEditable) {
    const value = (typeof initialValue === 'object') ? JSON.stringify(initialValue) : initialValue;
    return (
      <ToggleEditWrapper
        width={'100%'}
        textAlign={textAlign || 'center'}
        value={value}
        rowEditable={rowEditable}
        setRowEditable={setRowEditable}
        editable={editable}
      />
    );
  }

  return (
    <ParsePropUpdater object={original._object} property={id}>
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
              pl={3}
              margin={'0'}
              height={'45px'}
              fontSize={'sm'}
            />
            {discussion && <DiscussionButton
              type='icon'
              object={original._object}
              context={id}
              title={discussionTitle && discussionTitle(original._object)}
            />}
          </>
        )
      }}
    </ParsePropUpdater>
  )
}
