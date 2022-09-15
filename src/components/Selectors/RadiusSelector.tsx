import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';

interface RadiusSelectorProps {
  label?: string;
  initialValue?: {
    value: any;
    label: string;
  };
  onSelect?: (value: any) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  style?: any;
}

const opts = [
  5,
  10,
  25,
  50,
  100,
  250,
  500,
]

const RadiusSelector = (props: RadiusSelectorProps) => {
  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#484848", "#718096");
  const { isLoading, isDisabled, initialValue, onSelect, isClearable, style } = props;

  const [value, setValue] = useState<{
    value: string;
    label: string;
  }>(initialValue)

  const [options, setOptions] = useState<{ value: null; label: string; }[]>([])

  useEffect(() => {
    let options = opts.map(radius => ({
      value: radius,
      label: `${radius} miles`,
    }));
    setOptions(options);
  }, [])

  const handleInputChange = (newValue: SingleValue<{
    value: string;
    label: string;
  }>) => {
    if (newValue && newValue.value) {
      setValue(newValue);
      if (onSelect) onSelect(newValue.value);
    } else {
      setValue(null);
      if (onSelect) onSelect(null)
    }
  };

  const error = false;

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: style?.width,
    }),
    control: (provided) => ({
      ...provided,
      width: style?.width || '100%',
      borderColor: (error) ? 'red' : null,
      backgroundColor: bgColor,
      color: textColor,
      margin: 0,
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
    <Select
      isDisabled={isDisabled}
      isLoading={isLoading}
      value={value}
      defaultValue={value}
      options={options}
      onChange={handleInputChange}
      isClearable={isClearable}
      styles={customStyles}
      placeholder="Search Radius"
    />
  )
}

export default RadiusSelector;
