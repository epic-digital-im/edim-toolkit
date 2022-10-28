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

import slugify from 'slugify';

interface EditorTextFieldProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export { default as EditorInput } from '../../components/Editor/Editor';

export const EditorTextInput: React.FC<EditorTextFieldProps> = (props) => {
  const { onChange } = props;
  const [value, setValue] = useState(props.value);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (value: number | null) => {
    setValue(value);
    if (onChange) onChange(value);
  };

  return (
    <Editor
      onChange={handleChange}
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

export const EditorTextField = ({ label, id, height, ...props }: any) => {
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
      <Editor
        id={field.name.replace(/[\W_]+/g, "")}
        value={field.value}
        onChange={helpers.setValue}
        height={height}
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
