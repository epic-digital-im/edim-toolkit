import React, { useState, useEffect } from "react";
import { Switch, useToast } from "@chakra-ui/react";
import DiscussionButton from '../../components/Buttons/DiscussionButton';
import ToggleEditWrapper from "./ToggleEditWrapper";
import { PluginTypes } from '../types';

export const EditableBooleanCell = (props) => {
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
  const toast = useToast();
  const [value, setValue] = useState(Boolean(initialValue));
  const [prevValue, setPrevValue] = useState(Boolean(initialValue));

  const handleUpdate = () => {
    const object = original;
    const updatedValue = !value;
    setIsLoading(true);
    object.set(id, updatedValue);
    object.save()
      .then(() => {
        setIsLoading(false);
        setValue(updatedValue);
        toast({
          title: `${id} updated`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }).catch((e) => {
        setIsLoading(false);
        setValue(prevValue);
        toast({
          title: `ERROR: ${e.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }

  const onChange = () => {
    handleUpdate();
  }

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <ToggleEditWrapper
      width={'100%'}
      textAlign={textAlign || 'center'}
      value={value ? 'Yes' : 'No'}
      editable={editable}
    >
      <>
        <Switch
          isDisabled={isLoading}
          isChecked={value}
          onChange={onChange}
        />
        {discussion && <DiscussionButton
          type='icon'
          object={original}
          context={id}
          title={discussionTitle && discussionTitle(original)}
        />}
      </>
    </ToggleEditWrapper>
  )
}

export default {
  name: 'EditableBooleanCell',
  type: PluginTypes.CellRenderer,
  component: EditableBooleanCell
}
