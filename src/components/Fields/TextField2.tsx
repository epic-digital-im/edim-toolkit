import { useField } from "formik";

import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

import { useColorPalette } from "../../hooks";

const TextField = ({ label, ...props }: any) => {
  const { textColor } = useColorPalette();
  const [field, meta, helpers] = useField(props);

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <Input
        fontSize="xs"
        borderColor={meta.touched && meta.error ? "red.500" : "gray.300"}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
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

export default TextField;