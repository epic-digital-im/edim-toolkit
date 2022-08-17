import React from 'react';
import { useField } from "formik";

import {
  Box,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

import ClassSearchSelect from '../../components/SearchSelect/ClassSearchSelect';
import useColorPalette from '../../hooks/useColorPalette';

export const ClassSearchSelectField = ({ label, handleSelect, ...props }: any) => {
  const { textColor } = useColorPalette();
  const [field, meta, helpers] = useField(props);

  const handleSelected = (value: any) => {
    helpers.setValue(value);
    if (handleSelect) handleSelect(value, helpers);
  }

  return (
    <Box position={'relative'}>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <ClassSearchSelect
        borderColor={meta.touched && meta.error ? "red.500" : "gray.300"}
        placeholder={label}
        borderRadius="15px"
        fontSize="sm"
        size="lg"
        onSelect={handleSelected}
        error={meta.touched && meta.error}
        {...props}
      />
      {meta.touched && meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize="xs"
          fontWeight="normal"
          mt={2}
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </Box>
  );
};
