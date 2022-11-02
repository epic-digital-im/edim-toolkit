import { useField } from "formik";
import { useState, useEffect, useMemo } from 'react';

import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
  HStack,
  Box,
} from "@chakra-ui/react";

export const monthlist = [
  'SELECT',
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const daysInMonth: { [key: string]: number } = {
  "January": 31,
  "February": 28,
  "March": 31,
  "April": 30,
  "May": 31,
  "June": 30,
  "July": 31,
  "August": 31,
  "September": 30,
  "October": 31,
  "November": 30,
  "December": 31,
};


export const DateSelectField = ({ label, ...props }: any) => {
  const [field, meta, helpers] = useField(props);

  const [dayfield, daymeta, dayhelpers] = useField({ name: 'day' });
  const [monthfield, monthmeta, monthhelpers] = useField({ name: 'month' });
  const [yearfield, yearmeta, yearhelpers] = useField({ name: 'year' });

  const textColor = useColorModeValue("gray.700", "white");

  const defaultOption = 'SELECT';
  const inputBorder = "gray.300";
  const inputBorderError = "red.500";

  const years = useMemo(() => {
    const years = [];
    const startYear = new Date().getFullYear() - 16;
    for (var i = startYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  }, [])

  const days = useMemo(() => {
    const days = [];
    for (var i = 1; i <= daysInMonth[monthfield.value]; i++) {
      days.push(i);
    }
    return days;
  }, [monthfield.value])

  useEffect(() => {
    if (
      dayfield.value !== 0 &&
      monthfield.value !== 'SELECT' &&
      yearfield.value !== 0
    ) {
      helpers.setValue(`${monthlist.indexOf(monthfield.value)}/${dayfield.value}/${yearfield.value}`)
    } else {
      helpers.setValue('')
    }
  }, [dayfield.value, monthfield.value, yearfield.value]);

  return (
    <FormControl>
      <FormLabel
        color={textColor}
        fontWeight="bold"
        fontSize={{ sm: 'xs', md: 'sm' }}
      >
        {label}
      </FormLabel>
      <HStack>
        <Box width="40%">
          <Select
            borderRadius="15px"
            fontSize={{ sm: 'xs', md: 'sm' }}
            borderColor={monthmeta.touched && monthmeta.error ? inputBorderError : inputBorder}
            {...monthfield}
          >
            {monthlist.map((m, index) => (
              <option key={`${m}_${index}`} value={m}>{m}</option>
            ))}
          </Select>
          {/* {monthmeta.touched && monthmeta.error ? (
            <FormLabel
              width={'100%'}
              textAlign={"center"}
              color={"red"}
              fontSize={{ sm: 'xs', md: 'sm' }}
              fontWeight="nxormal"
              mt={2}
            >
              {monthmeta.error}
            </FormLabel>
          ) : null} */}
        </Box>
        <Box width="30%">
          <Select
            borderRadius="15px"
            fontSize={{ sm: 'xs', md: 'sm' }}
            borderColor={daymeta.touched && daymeta.error ? inputBorderError : inputBorder}
            {...dayfield}
          >
            <option value={0}>{defaultOption}</option>
            {days.map((d, index) => (
              <option key={`${d}_${index}`} value={d}>{d}</option>
            ))}
          </Select>
          {/* {daymeta.touched && daymeta.error ? (
            <FormLabel
              width={'100%'}
              textAlign={"center"}
              color={"red"}
              fontSize={{ sm: 'xs', md: 'sm' }}
              fontWeight="nxormal"
              mt={2}
            >
              {daymeta.error}
            </FormLabel>
          ) : null} */}
        </Box>
        <Box width="30%">
          <Select
            borderRadius="15px"
            fontSize={{ sm: 'xs', md: 'sm' }}
            borderColor={yearmeta.touched && yearmeta.error ? inputBorderError : inputBorder}
            {...yearfield}
          >
            <option value={0}>{defaultOption}</option>
            {years.map((y, index) => (
              <option key={`${y}_${index}`} value={y}>{y}</option>
            ))}
          </Select>
          {/* {yearmeta.touched && yearmeta.error ? (
            <FormLabel
              width={'100%'}
              textAlign={"center"}
              color={"red"}
              fontSize={{ sm: 'xs', md: 'sm' }}
              fontWeight="nxormal"
              mt={2}
            >
              {yearmeta.error}
            </FormLabel>
          ) : null} */}
        </Box>
      </HStack>
      {meta.touched && meta.error ? (
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

export default DateSelectField;
