import { useField } from "formik";

import {
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";

const TextField = ({ label, ...props }: any) => {
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
      <Textarea
        borderRadius="15px"
        fontSize="xs"
        borderColor={meta.error ? "red.500" : "gray.300"}
        {...field}
        {...props}
      />
      {meta.error ? (
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