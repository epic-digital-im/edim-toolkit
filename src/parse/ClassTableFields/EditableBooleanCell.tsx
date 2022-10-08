import React, { useState, useEffect } from "react";
import { Switch, useToast } from "@chakra-ui/react";
import DiscussionButton from '../../components/Buttons/DiscussionButton';

export const EditableBooleanCell = ({
  value: initialValue,
  row: { original },
  column: { id, editable, discussion, discussionTitle, },
}) => {
  const toast = useToast();
  const [value, setValue] = useState(Boolean(initialValue));
  const [prevValue, setPrevValue] = useState(Boolean(initialValue));

  const handleUpdate = () => {
    const object = original._object;
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

  if (!editable) {
    return value ? 'Yes' : 'No'
  }

  return (
    <>
      <Switch
        isDisabled={isLoading}
        isChecked={value}
        onChange={onChange}
      />
      {discussion && <DiscussionButton
        type='icon'
        object={original._object}
        context={id}
        title={discussionTitle && discussionTitle(original._object)}
      />}
    </>
  )
}
