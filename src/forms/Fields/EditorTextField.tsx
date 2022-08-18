import React from 'react';
import { useField } from "formik";
import { useEffect, useState } from "react";
import { ParsePropUpdater } from "../../parse/PropUpdater";
import Editor from '../../components/Editor/Editor';
import { useColorPalette } from "@app/theme";

import {
  FormControl,
  FormLabel
} from "@chakra-ui/react";

interface EditorTextFieldProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export const EditorTextInput: React.FC<EditorTextFieldProps> = (props) => {
  const { onChange, placeholder } = props;
  const [value, setValue] = useState(props.value);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleClose = () => {
    setFocused(false)
  }

  const handleChange = (value: number | null) => {
    setValue(value);
    if (onChange) onChange(value);
  };

  return (
    <Editor
      onChange={handleChange}
      placeholder={placeholder}
      value={value}
    />
  )
}

interface EditorTextParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const EditorTextParse: React.FC<EditorTextParseProps> = (props) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <EditorTextInput
            value={value}
            onChange={onChange}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const EditorTextField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const { textColor } = useColorPalette();
  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <EditorTextInput
        {...props}
        {...field}
        onChange={helpers.setValue}
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
    </FormControl>
  );
};

export default EditorTextField;
