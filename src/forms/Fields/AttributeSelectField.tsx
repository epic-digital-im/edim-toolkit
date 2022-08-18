import { useField } from "formik";

import {
  Box,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

import ClassSearchSelect from '../../components/Selectors/ClassSearchSelect';

export const AttributeSelectField = ({ label, handleSelect, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const textColor = useColorModeValue("gray.700", "white");

  const handleSelected = (value: any) => {
    helpers.setValue(value);
    if (handleSelect) handleSelect(value, helpers);
  }

  return (
    <Box position={'relative'}>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <ClassSearchSelect
        borderColor={meta.touched && meta.error ? "red.500" : "gray.300"}
        placeholder={label}
        borderRadius="15px"
        fontSize="sm"
        size="lg"
        onSelect={handleSelected}
        onClear={handleClear}
        error={meta.touched && meta.error}
        {...props}
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
    </Box>
  );
};

export default AttributeSelectField;