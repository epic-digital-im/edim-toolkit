import { useField } from "formik";

import {
  Box,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const TextField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  return (
    <Box position={'relative'} mb={'36px'}>
      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
        {label}
      </FormLabel>
      <Input
        borderColor={meta.touched && meta.error ? "red.500" : "gray.300"}
        placeholder={label}
        borderRadius="15px"
        fontSize="sm"
        size="lg"
        {...field} {...props}
      />
      {meta.touched && meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize="xs"
          fontWeight="normal"
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </Box>
  );
};

export default TextField;