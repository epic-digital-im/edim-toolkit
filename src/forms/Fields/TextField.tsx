import React from 'react';
import { useField } from "formik";
import { Input, ComponentWithAs, FormControlProps, InputProps } from '@chakra-ui/react';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import { useColorPalette } from "@app/theme";

import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface TextParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const TextParse: React.FC<TextParseProps> = (props) => {
  const { colorMode, textColor, inputBgColor, inputBorderColor } = useColorPalette();
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <Input
            value={value}
            onChange={onChange}
            color={textColor}
            backgroundColor={inputBgColor}
            borderColor={colorMode === 'dark' ? inputBorderColor : null}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

interface TextFieldProps {
  formControl?: ComponentWithAs<"div", FormControlProps>;
  label: string;
  props: ComponentWithAs<"input", InputProps>;
}

export const TextField: React.FC<TextFieldProps> = ({ label, formControl, ...props }) => {
  const { colorMode, textColor, inputBgColor, inputBorderColor } = useColorPalette();
  const [field, meta, helpers] = useField(props);

  const borderColor = (colorMode === 'dark')
    ? meta.touched && meta.error ? "red.500" : inputBorderColor
    : meta.touched && meta.error ? "red.500" : null

  return (
    <FormControl {...formControl}>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <Input
        fontSize="xs"
        borderColor={borderColor}
        color={textColor}
        backgroundColor={inputBgColor}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize="xs"
          fontWeight="nxormal"
          mt={2}
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </FormControl>
  );
};

