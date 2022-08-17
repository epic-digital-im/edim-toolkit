import React from 'react';
import { useField } from "formik";
import { Input } from '@chakra-ui/react';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import { useColorPalette } from "../../hooks";

import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface TextParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const TextParse: React.FC<TextParseProps> = (props) => {
  const { textColor, inputBgColor, inputBorderColor } = useColorPalette();
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <Input
            value={value}
            onChange={onChange}
            color={textColor}
            backgroundColor={inputBgColor}
            borderColor={inputBorderColor}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const TextField = ({ label, ...props }: any) => {
  const { textColor, inputBgColor, inputBorderColor } = useColorPalette();
  const [field, meta, helpers] = useField(props);

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <Input
        fontSize="xs"
        borderColor={meta.touched && meta.error ? "red.500" : inputBorderColor}
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

