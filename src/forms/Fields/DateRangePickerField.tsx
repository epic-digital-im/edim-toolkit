import React from 'react';
import { useField } from "formik";
import { useEffect, useState } from "react";
import { DateRangePicker } from 'react-dates';
import { END_DATE, START_DATE } from 'react-dates/src/constants';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import moment from 'moment-timezone';
import { useColorPalette } from "@app/theme";

import {
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

interface DatePickerFieldProps {
  name: string;
  onChange: (values: { startDate: Date | null, endDate: Date | null }) => void;
  error?: boolean;
  autoFocusEndDate?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
}

export const DateRagePickerInput: React.FC<DatePickerFieldProps> = (props) => {
  const { onChange, name, error, ...rest } = props;
  const startDateValue = props.startDate?.iso || props.startDate;
  const endDateValue = props.endDate?.iso || props.endDate;
  const initialStartDate = startDateValue ? moment(startDateValue) : null
  const initialEndDate = endDateValue ? moment(endDateValue) : null
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setaEndDate] = useState(initialEndDate);
  const [focusedInput, setFocusedInput] = useState();

  useEffect(() => {
    setStartDate(initialStartDate);
    setaEndDate(initialEndDate);
  }, [props.startDate, props.endDate]);

  const handleClose = () => {
    setFocusedInput(false)
  }

  function onDatesChange({ startDate, endDate }) {
    setStartDate(startDate);
    setaEndDate(endDate);
    onChange({
      startDate: startDate?.toDate(),
      endDate: endDate?.toDate()
    });
  }

  function onFocusChange(focusedInput) {
    setFocusedInput(!focusedInput ? START_DATE : focusedInput);
  }

  return (
    <Box className={error ? 'error' : ''}>
      <DateRangePicker
        onDatesChange={onDatesChange}
        onFocusChange={onFocusChange}
        focusedInput={focusedInput}
        startDate={startDate}
        endDate={endDate}
        onClose={handleClose}
        isDayBlocked={() => false}
        isOutsideRange={() => false}
        {...rest}
      />
    </Box>
  )
}

interface DateRagePickerParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const DateRagePickerParse: React.FC<DateRagePickerParseProps> = (props) => {
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <DateRangePicker
            value={value}
            onChange={onChange}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const DateRagePickerField = ({ label, orientation, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const { textColor } = useColorPalette();
  return (
    <FormControl>
      <FormLabel
        color={meta.error ? 'red' : textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <DateRagePickerInput
        {...props}
        {...field}
        onChange={helpers.setValue}
        error={meta.error}
      />
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

export default DateRagePickerField;
