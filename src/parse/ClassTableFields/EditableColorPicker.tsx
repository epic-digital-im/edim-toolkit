import React, { useState, useEffect } from "react";
import { Input, useToast } from "@chakra-ui/react";
import DiscussionButton from '../../components/Buttons/DiscussionButton';

function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export const EditableColorPicker = ({
  value: initialValue,
  row: { original },
  column, // This is a custom function that we supplied to our table instance
}) => {
  const { id, editable, discussion } = column;
  const toast = useToast();
  const [value, setValue] = useState(initialValue);
  const [prevValue, setPrevValue] = useState(initialValue);

  const debouncedSearchTerm = useDebounce(value, 500);

  useEffect(() => {
    handleUpdate();
  }, [debouncedSearchTerm])

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.value !== value) {
      setValue(e.target.value);
    }
  }

  const handleUpdate = () => {
    const object = original._object;
    if (object.get(id) === debouncedSearchTerm) return;
    setIsLoading(true);
    setPrevValue(value);
    object.set(id, value || '');
    object.save().then(() => {
      setIsLoading(false);
      toast({
        title: `${id} updated`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }).catch((e) => {
      setIsLoading(false);
      setValue(prevValue);
      toast({
        title: `ERROR: ${e.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    });
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return initialValue || null;
  }

  return (
    <>
      <Input
        isDisabled={isLoading}
        borderRadius={0}
        borderColor="transparent"
        value={value}
        onChange={handleChange}
        background={'transparent'}
        textAlign={'center'}
        padding={'0'}
        margin={'0'}
        height={'45px'}
        fontSize={'sm'}
        type="color"
      />
      {discussion && <DiscussionButton
        type='icon'
        object={original._object}
        property={id}
      />}
    </>
  )
}
