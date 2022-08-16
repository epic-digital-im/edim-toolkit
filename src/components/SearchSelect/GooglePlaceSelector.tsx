import Parse from 'parse';
import CreateSelect from 'react-select';
import { useState, useMemo } from "react";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import config from '../../config'
import { Place } from '@app/shared/types';


interface GooglePlacesSelectProps {
  onChange?: (place: Place) => void, fieldPrefix?: string, label?: string
  initialValue?: Place;
  disabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  style?: any;
}

const GooglePlaces = ({ onChange, initialValue, style, disabled, isLoading, isClearable, isMulti }: GooglePlacesSelectProps) => {
  const [value, setValue] = useState<any>(initialValue);
  const [error, setError] = useState<any>();

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: config.googleMapsApiKey,
  });

  const getPlaceId = (place_id: string) => {
    if (place_id) {
      Parse.Cloud.run('getGooglePlaceById', { place_id }).then((result) => {
        if (onChange) {
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


  const customStyles = {
    container: (provided, state) => ({
      ...provided,
    }),
    control: (provided, state) => ({
      ...provided,
      width: style?.width,
      borderColor: (error) ? 'red' : null,
    }),
    menu: (provided, state) => ({
      ...provided,
    })
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