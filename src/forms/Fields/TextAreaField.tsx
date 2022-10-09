import React from 'react';
import { useField } from "formik";
import { ParsePropUpdater } from "../../parse/PropUpdater";

import {
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

interface TextParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const TextAreaParse: React.FC<TextParseProps> = (props) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <TextInput
            value={value}
            onChange={onChange}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const TextAreaField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <FormControl>
      <FormLabel
        borderColor={meta.error ? "red.500" : textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <Textarea
        borderRadius="15px"
        fontSize="xs"
        borderColor={meta.error ? "red.500" : "gray.300"}
        {...field}
        {...props}
      />
      {meta.error ? (
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
