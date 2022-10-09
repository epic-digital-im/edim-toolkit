import React from 'react';
import { useField } from "formik";
import { Input, ComponentWithAs, FormControlProps, InputProps } from '@chakra-ui/react';
import { ParsePropUpdater } from "../../parse/PropUpdater";
import { useColorPalette } from "@app/theme";
import { ClassNames } from '@app/shared/types';

import {
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import GooglePlaceSelector from '../../components/Selectors/GooglePlaceSelector';

interface GooglePlaceSelectorParseProps {
  object: Parse.Object<any>;
  property: string;
}

export const GooglePlaceSelectorParse: React.FC<GooglePlaceSelectorParseProps> = (props) => {
  const { colorMode, textColor, inputBgColor, inputBorderColor } = useColorPalette();
  return (
    <ParsePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <Input
            value={value}
            onChange={onChange}
            color={textColor}
            backgroundColor={inputBgColor}
            borderColor={colorMode === 'dark' ? inputBorderColor : null}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

interface GooglePlaceSelectorFieldProps {
  googleMapsApiKey: string;
  formControl?: ComponentWithAs<"div", FormControlProps>;
  label: string;
  props: ComponentWithAs<"input", InputProps>;
  name: string;
  style: React.CSSProperties;
}

export const GooglePlaceSelectorField: React.FC<GooglePlaceSelectorFieldProps> = ({ label, formControl, googleMapsApiKey, ...props }) => {
  const { textColor } = useColorPalette();
  const [, meta, helpers] = useField(props);

  const invalidColor = meta.touched && meta.error ? "red.500" : textColor;


  const handleChange = (place: any) => {
    helpers.setValue({
      className: ClassNames.GooglePlace,
      objectId: place.objectId,
      __type: "Pointer"
    });
  }

  return (
    <FormControl {...formControl}>
      <FormLabel
        color={invalidColor}
        fontWeight="bold"
        fontSize="xs"
      >
        {label}
      </FormLabel>
      <GooglePlaceSelector
        googleMapsApiKey={googleMapsApiKey}
        onChange={handleChange}
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

