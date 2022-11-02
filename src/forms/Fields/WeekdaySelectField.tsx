import { useField } from "formik";
import React, { useState, useEffect, useMemo } from 'react';

import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
  HStack,
  Box,
} from "@chakra-ui/react";

import { weekdayList } from "@app/shared/types";

export const WeekdaySelectField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  const textColor = useColorModeValue("gray.700", "white");

  const inputBorder = "gray.300";
  const inputBorderError = "red.500";

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize={{ sm: 'xs', md: 'sm' }}
      >
        {label}
      </FormLabel>
      <Select
        borderRadius="15px"
        fontSize={{ sm: 'xs', md: 'sm' }}
        borderColor={meta.error ? inputBorderError : inputBorder}
        {...field}
      >
        <option value={"SELECT"}>{"SELECT"}</option>
        {weekdayList.map((option, index) => (
          <option key={`${option}_${index}`} value={index}>{option}</option>
        ))}
        <option value={7}>{'Unknown - Please help me find this.'}</option>
      </Select>
      {meta.error ? (
        <FormLabel
          width={'100%'}
          textAlign={"center"}
          color={"red"}
          fontSize={{ sm: 'xs', md: 'sm' }}
          fontWeight="normal"
          mt={2}
        >
          {meta.error}
        </FormLabel>
      ) : null}
    </FormControl>
  );
};

export default WeekdaySelectField;
