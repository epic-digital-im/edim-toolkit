import React from 'react';
import { useField } from "formik";
import { useEffect, useState } from "react";
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import { useColorPalette } from "@app/theme";

import {
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

interface SliderFieldProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export const SliderInput: React.FC<SliderFieldProps> = (props) => {
  const { onChange, name } = props;
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
    <Slider aria-label='slider-ex-1' defaultValue={30} onChange={handleChange}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  )
}

interface SliderParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const SliderParse: React.FC<SliderParseProps> = (props) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <SliderInput
            value={value}
            onChange={onChange}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const SliderField = ({ label, ...props }: any) => {
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
      <SliderInput
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

export default SliderField;
