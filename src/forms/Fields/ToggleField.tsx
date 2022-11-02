import React from 'react';
import { useField } from "formik";

import {
  FormControl,
  FormLabel,
  useColorModeValue,
  Switch,
} from "@chakra-ui/react";

export const ToggleField = ({ label, labelLeft, ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  const textColor = useColorModeValue("gray.700", "white");
  const defaultOption = 'SELECT';
  const inputBorder = "gray.300";
  const inputBorderError = "red.500";

  const fieldId = `${props.name}_toggle`;

  return (
    <FormControl display='flex' alignItems='center'>
      {labelLeft ? (
        <>
          <FormLabel fontSize={{ sm: 'xs', md: 'sm' }} color={textColor} htmlFor={fieldId} mb='0' mr='1rem'>
            {label}
          </FormLabel>
          <Switch isChecked={field.value} onChange={() => helpers.setValue(!field.value)} id={fieldId} />
        </>
      ) : (
        <>
          <Switch isChecked={field.value} onChange={() => helpers.setValue(!field.value)} id={fieldId} />
          <FormLabel fontSize={{ sm: 'xs', md: 'sm' }} color={textColor} htmlFor={fieldId} mb='0' ml='1rem'>
            {label}
          </FormLabel>
        </>
      )}
      {meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize={{ sm: 'xs', md: 'sm' }}
          fontWeight="nxormal"
          mt={2}
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </FormControl>
  );
};

export default ToggleField;
