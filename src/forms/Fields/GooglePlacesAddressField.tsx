import React from 'react';
import Parse from 'parse/dist/parse.min.js';
import { useState } from "react";
import { Input, Button, Box, FormControl, FormLabel, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import GoogleService from '@app/shared/services/google';
import { useField } from 'formik';

import { ClassNames, Place } from '@app/shared/types';

import {
  FaHome
} from "react-icons/fa";

export const GooglePlacesAddressField = ({ googleMapsApiKey, onChange, fieldPrefix }: { onChange?: (place: Place) => void, fieldPrefix?: string, label?: string, googleMapsApiKey: string }) => {
  const googleSErvice = new GoogleService();
  const textColor = useColorModeValue("gray.700", "white");
  const prefix = fieldPrefix ? fieldPrefix + '.' : '';
  const [error, setError] = useState<string | undefined>();

  const [addressLine1Field, addressLine1Meta, addressLine1Helpers] = useField({ name: `${prefix}addressLine1` });
  const [addressLine2Field, addressLine2Meta, addressLine2Helpers] = useField({ name: `${prefix}addressLine2` });
  const [cityField, cityMeta, cityHelpers] = useField({ name: `${prefix}city` });
  const [stateField, stateMeta, stateHelpers] = useField({ name: `${prefix}state` });
  const [zipField, zipMeta, zipHelpers] = useField({ name: `${prefix}zip` });
  const [countryField, countryMeta, countryHelpers] = useField({ name: `${prefix}country` });
  const [placeField, placeMeta, placeHelpers] = useField({ name: `${prefix}place` });

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: googleMapsApiKey,
  });

  const [addressSelected, setAddressSelected] = useState(false);

  const getPlaceId = async (place_id: string) => {
    if (place_id) {

      const invalid = await Parse.Cloud.run('validate', {
        objectClass: ClassNames.Property,
        name: 'place_id',
        value: place_id,
      });

      if (invalid) {
        setError('WARNING: This Address is already in use');
      } else {
        setError(undefined);
      }

      const result = await Parse.Cloud.run('getGooglePlaceById', { place_id });
      const place = result;
      const address = googleSErvice.getAddressModel(place);

      const {
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        country,
      } = address;

      addressLine1Helpers.setValue(addressLine1);
      addressLine2Helpers.setValue(addressLine2);
      cityHelpers.setValue(city);
      stateHelpers.setValue(state);
      zipHelpers.setValue(zip);
      countryHelpers.setValue(country);

      setAddressSelected(true);

      placeHelpers.setValue(place);

      if (onChange) {
        onChange(result);
      }
    }
  };

  const handleInputChange = (event: any) => {
    setAddressSelected(false);
    getPlacePredictions({ input: event.target.value });
    addressLine1Field.onChange(event);
  }

  return (
    <>
      <FormControl position={'relative'}>
        <FormLabel
          color={textColor}
          fontWeight="bold"
          fontSize={{ sm: 'xs', md: 'sm' }}
        >
          Address 1
        </FormLabel>
        <Input
          borderRadius="15px"
          placeholder="eg. Street 120"
          fontSize={{ sm: 'xs', md: 'sm' }}
          borderColor={addressLine1Meta.touched && addressLine1Meta.error ? "red.500" : "gray.300"}
          {...addressLine1Field}
          onChange={handleInputChange}
        />
        {addressLine1Meta.touched && addressLine1Meta.error ? (
          <FormLabel
            width={'100%'}
            textAlign={"center"}
            color={"red"}
            fontSize={{ sm: 'xs', md: 'sm' }}
            fontWeight="nxormal"
            mt={2}
          >
            {addressLine1Meta.error}
          </FormLabel>
        ) : null}
        {!addressSelected && !isPlacePredictionsLoading && (
          <Box>
            {placePredictions.map((prediction) => (
              <Button key={prediction.place_id} leftIcon={<FaHome />} justifyContent={'start'} overflowX={'hidden'} width={'100%'} my={'0.5rem'} size="xs" onClick={() => {
                getPlaceId(prediction.place_id)
              }}>
                {prediction.description}
              </Button>
            ))}
          </Box>
        )}
        {error && (
          <FormLabel width={'100%'} textAlign={"center"} color={"red"} fontSize={{ sm: 'xs', md: 'sm' }} fontWeight="nxormal" mt={1.5}>
            {error}
          </FormLabel>
        )}
      </FormControl>
      <FormControl mb={'1.5rem'}>
        <FormLabel
          color={textColor}
          fontWeight="bold"
          fontSize={{ sm: 'xs', md: 'sm' }}
        >
          Address 2
        </FormLabel>
        <Input
          borderRadius="15px"
          placeholder="eg. Street 220"
          fontSize={{ sm: 'xs', md: 'sm' }}
          borderColor={addressLine2Meta.touched && addressLine2Meta.error ? "red.500" : "gray.300"}
          {...addressLine2Field}
        />
        {addressLine2Meta.touched && addressLine2Meta.error ? (
          <FormLabel
            width={'100%'}
            textAlign={"center"}
            color={"red"}
            fontSize={{ sm: 'xs', md: 'sm' }}
            fontWeight="nxormal"
            mt={2}
          >
            {addressLine2Meta.error}
          </FormLabel>
        ) : null}
      </FormControl>
      <Grid
        templateColumns={{ sm: "1fr 1fr", md: "1fr 1fr" }}
        gap="30px"
      >
        <GridItem>
          <FormControl>
            <FormLabel
              color={textColor}
              fontWeight="bold"
              fontSize={{ sm: 'xs', md: 'sm' }}
            >
              City
            </FormLabel>
            <Input
              borderRadius="15px"
              fontSize={{ sm: 'xs', md: 'sm' }}
              borderColor={cityMeta.touched && cityMeta.error ? "red.500" : "gray.300"}
              {...cityField}
            />
            {cityMeta.touched && cityMeta.error ? (
              <FormLabel
                width={'100%'}
                textAlign={"center"}
                color={"red"}
                fontSize={{ sm: 'xs', md: 'sm' }}
                fontWeight="nxormal"
                mt={2}
              >
                {cityMeta.error}
              </FormLabel>
            ) : null}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel
              color={textColor}
              fontWeight="bold"
              fontSize={{ sm: 'xs', md: 'sm' }}
            >
              State
            </FormLabel>
            <Input
              borderRadius="15px"
              fontSize={{ sm: 'xs', md: 'sm' }}
              borderColor={stateMeta.touched && stateMeta.error ? "red.500" : "gray.300"}
              {...stateField}
            />
            {stateMeta.touched && stateMeta.error ? (
              <FormLabel
                width={'100%'}
                textAlign={"center"}
                color={"red"}
                fontSize={{ sm: 'xs', md: 'sm' }}
                fontWeight="nxormal"
                mt={2}
              >
                {stateMeta.error}
              </FormLabel>
            ) : null}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel
              color={textColor}
              fontWeight="bold"
              fontSize={{ sm: 'xs', md: 'sm' }}
            >
              ZIP
            </FormLabel>
            <Input
              borderRadius="15px"
              fontSize={{ sm: 'xs', md: 'sm' }}
              borderColor={zipMeta.touched && zipMeta.error ? "red.500" : "gray.300"}
              {...zipField}
            />
            {zipMeta.touched && zipMeta.error ? (
              <FormLabel
                width={'100%'}
                textAlign={"center"}
                color={"red"}
                fontSize={{ sm: 'xs', md: 'sm' }}
                fontWeight="nxormal"
                mt={2}
              >
                {zipMeta.error}
              </FormLabel>
            ) : null}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel
              color={textColor}
              fontWeight="bold"
              fontSize={{ sm: 'xs', md: 'sm' }}
            >
              Coutry
            </FormLabel>
            <Input
              borderRadius="15px"
              fontSize={{ sm: 'xs', md: 'sm' }}
              borderColor={countryMeta.touched && countryMeta.error ? "red.500" : "gray.300"}
              {...countryField}
            />
            {countryMeta.touched && countryMeta.error ? (
              <FormLabel
                width={'100%'}
                textAlign={"center"}
                color={"red"}
                fontSize={{ sm: 'xs', md: 'sm' }}
                fontWeight="nxormal"
                mt={2}
              >
                {countryMeta.error}
              </FormLabel>
            ) : null}
          </FormControl>
        </GridItem>
      </Grid>
    </>
  );
};

export default GooglePlacesAddressField;