import React, { useEffect, useState } from 'react';
import { useField } from "formik";

import {
  Box,
  FormLabel,
} from "@chakra-ui/react";

import ClassSearchSelect from '../../components/Selectors/ClassSearchSelect';

import { useColorPalette } from "@app/theme";

export const ClassSearchSelectField = ({ label, handleSelect, object, isMulti, initialValue, ...props }: any) => {
  const { textColor } = useColorPalette();
  const [intialValue, setIntialValue] = useState(initialValue || []);
  const [field, meta, helpers] = useField(props);

  const handleSelected = (value: any) => {
    helpers.setValue(value);
    if (handleSelect) handleSelect(value, helpers);
  }

  useEffect(() => {
    if (!isMulti || !object) return;
    const t = object?.get(field.name) as Parse.Relation<any>;
    if (t && t.query) {
      t.query().find().then((res) => {
        if (res && res.length > 0) {
          const options = res.map((r: Parse.Object<any>) => r.toJSON());
          setIntialValue(options);
          helpers.setValue(res);
        } else {
          setIntialValue([]);
        }
      });
    }
  }, [object]);

  return (
    <Box position={'relative'}>
      <FormLabel
        color={meta.error ? "red.500" : textColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <ClassSearchSelect
        borderColor={meta.error ? "red.500" : "gray.300"}
        placeholder={label}
        borderRadius="15px"
        fontSize="sm"
        size="lg"
        onSelect={handleSelected}
        error={meta.error}
        isMulti={isMulti}
        initialValue={intialValue}
        {...props}
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
    </Box>
  );
};
