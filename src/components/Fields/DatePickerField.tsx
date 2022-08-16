import { useField } from "formik";
import { useEffect, useState } from "react";
import { SingleDatePicker } from 'react-dates';
import ParsePropUpdater from "./ParsePropUpdater";
import moment from 'moment-timezone';

import {
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";

interface DatePickerFieldProps {
  name: string;
  value: Date;
  onChange: (value: Date | null) => void;
}

export const SingleDatePickerInput: React.FC<DatePickerFieldProps> = (props) => {
  const { onChange, name } = props;
  const [value, setValue] = useState(props.value ? moment(props.value) : null);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    setValue(props.value ? moment(props.value) : null);
  }, [props.value]);

  const handleClose = () => {
    setFocused(false)
  }

  const handleChange = (value: moment.Moment | null) => {
    setValue(value);
    onChange(value !== null ? value.toDate() : null);
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

const DatePickerField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const textColor = useColorModeValue("gray.700", "white");
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
