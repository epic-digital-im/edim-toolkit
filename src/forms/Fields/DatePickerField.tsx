import React from 'react';
import { useField } from "formik";
import { useEffect, useState } from "react";
import { SingleDatePicker } from 'react-dates';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import moment from 'moment-timezone';
import { useColorPalette } from "@app/theme";

import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface DatePickerFieldProps {
  name: string;
  value: Date | string;
  onChange: (value: Date | null) => void;
}

export const SingleDatePickerInput: React.FC<DatePickerFieldProps> = (props) => {
  const { onChange, name } = props;
  const dateValue = props.value?.iso || props.value;
  const initialDate = dateValue ? moment(dateValue) : null
  const [value, setValue] = useState(initialDate);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    setValue(initialDate);
  }, [props.value]);

  const handleClose = () => {
    setFocused(false)
  }

  const handleChange = (value: moment.Moment | null) => {
    if (value === null) {
      setValue(null);
      onChange(null);
    } else {
      const d = value?.startOf('day');
      setValue(d);
      onChange(d.toDate());
    }
  };

  return (
    <SingleDatePicker
      id={`${name}_date`}
      date={value}
      onDateChange={handleChange}
      focused={focused}
      onFocusChange={({ focused }) => setFocused(focused)}
      onClose={handleClose}
      showClearDate
      isDayBlocked={() => false}
      isOutsideRange={() => false}
    />
  )
}

interface SingleDatePickerParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const SingleDatePickerParse: React.FC<SingleDatePickerParseProps> = (props) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <SingleDatePickerInput
            value={value}
            onChange={onChange}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const DatePickerField = ({ label, ...props }: any) => {
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
      <SingleDatePickerInput
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

export default DatePickerField;
