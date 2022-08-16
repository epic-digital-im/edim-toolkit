import { useField } from "formik";

import {
  FormControl,
  FormLabel,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";

import { userTypesList } from "@app/shared/types";

const WeekaySelect = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  const textColor = useColorModeValue("gray.700", "white");

  const defaultOption = 'SELECT';
  const inputBorder = "gray.300";
  const inputBorderError = "red.500";

  const options = [
    defaultOption,
    ...userTypesList,
  ]

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
      >
        {options.map((option, index) => (
          <option key={`${option}_${index}`} value={option}>{option}</option>
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

export default WeekaySelect;
