import React, { useEffect, useState } from 'react';
import { useField } from "formik";

import {
  FormControl,
  FormLabel,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";

import { ParsePropUpdater } from "../../parse/PropUpdater";

interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  valueGetter?: (value: any) => any;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, valueGetter, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const textColor = useColorModeValue("gray.700", "white");
  const inputBorder = "gray.300";
  const inputBorderError = "red.500";

  const handleChange = ({ target: { value } }) => {
    helpers.setValue(valueGetter ? valueGetter(value) : value);
  }

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <Select
        borderRadius="15px"
        fontSize="xs"
        borderColor={meta.error ? inputBorderError : inputBorder}
        {...field}
        onChange={handleChange}
        onBlur={handleChange}
      >
        <option value={"SELECT"}>{"SELECT"}</option>
        {options.map((option: any, index: number) => (
          <option key={`${option.value}_${index}`} value={option.value}>{option.label}</option>
        ))}
      </Select>
      {meta.error ? (
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
    </FormControl>
  );
};

interface SelectPropUpdaterProps {
  object: Parse.Object<any>;
  property: string;
  options: { value: any; label: string }[];
  valueGetter?: (value: any) => any;
}

export const SelectPropUpdater: React.FC<SelectPropUpdaterProps> = ({ valueGetter, options, ...props }) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        const [local, setLocal] = useState(value);

        const handleChange = (event) => {
          const v = event.target.value;
          if (value !== v) {
            onChange(valueGetter ? valueGetter(value) : value);
            setLocal(v);
          }
        }

        useEffect(() => {
          setLocal(valueGetter ? valueGetter(value) : value);
        }, [value])

        return (
          <Select
            onChange={handleChange}
            onBlur={handleChange}
            value={local}
          >
            <option value={null}>{"SELECT"}</option>
            {options.map((option: any, index: number) => (
              <option key={`${option.value}_${index}`} value={option.value}>{option.label}</option>
            ))}
          </Select>
        )
      }}
    </ParsePropUpdater>
  )
}

export default SelectField;
