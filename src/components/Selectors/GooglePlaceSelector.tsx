import React from 'react';
import Parse from 'parse/dist/parse.min.js';
import CreateSelect from 'react-select';
import { useState, useMemo } from "react";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Place } from '@app/shared/types';
import { useColorModeValue } from '@chakra-ui/react';

interface GooglePlacesSelectProps {
  googleMapsApiKey: string;
  onChange?: (place: Place) => void, fieldPrefix?: string, label?: string
  initialValue?: Place;
  disabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  style?: any;
}

const GooglePlaces = ({ googleMapsApiKey, onChange, initialValue, style, disabled, isLoading, isClearable, isMulti }: GooglePlacesSelectProps) => {
  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#484848", "#718096");
  const [value, setValue] = useState<any>(initialValue);
  const [error, setError] = useState<any>();

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: googleMapsApiKey,
  });

  const getPlaceId = (place_id: string) => {
    if (place_id) {
      Parse.Cloud.run('getGooglePlaceById', { place_id }).then((result) => {
        if (onChange) {
          console.log(result);
          onChange(result);
        }
      });
    }
  };

  const options = useMemo(() => {
    if (!placePredictions || placePredictions?.length == 0) return [];
    return placePredictions.map((place: any) => {
      return {
        label: place.description,
        value: place.place_id,
      };
    })
  }, [placePredictions]);

  const handleInputChange = (event: any) => {
    getPlacePredictions({ input: event.target.value });
  }

  const handleChange = (selectedOption: any, { action }: any) => {
    if (action === 'clear') {
      setValue();
      if (onChange) {
        onChange();
      }
    } else {
      setValue(selectedOption);
      getPlaceId(selectedOption?.value);
    }
  }

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
      backgroundColor: bgColor,
      color: textColor,
    }),
    control: (provided) => ({
      ...provided,
      width: style?.width,
      borderColor: (error) ? 'red' : null,
      backgroundColor: bgColor,
      color: textColor,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
    }),
    placeholder: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
    }),
    singleValue: (provided) => ({
      ...provided,
      backgroundColor: bgColor,
      color: textColor,
    })
  }

  return (
    <CreateSelect
      isLoading={isLoading || isPlacePredictionsLoading}
      isDisabled={disabled}
      defaultValue={value}
      value={value}
      options={options}
      onKeyDown={handleInputChange}
      onChange={handleChange}
      styles={customStyles}
      isClearable={isClearable}
      isMulti={isMulti}
      placeholder={`Select Place`}
    />
  )
};

export default GooglePlaces;