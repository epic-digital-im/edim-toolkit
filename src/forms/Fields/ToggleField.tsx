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
          <FormLabel color={textColor} htmlFor={fieldId} mb='0' mr='1rem'>
            {label}
          </FormLabel>
          <Switch isChecked={field.value} onChange={() => helpers.setValue(!field.value)} id={fieldId} />
        </>
      ) : (
        <>
          <Switch isChecked={field.value} onChange={() => helpers.setValue(!field.value)} id={fieldId} />
          <FormLabel color={textColor} htmlFor={fieldId} mb='0' ml='1rem'>
            {label}
          </FormLabel>
        </>
      )}

    </FormControl>
  );
};

export default ToggleField;
