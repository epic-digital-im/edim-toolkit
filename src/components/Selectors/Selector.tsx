import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';

interface Value {
  value: string;
  label: string;
}

interface SelectorProps {
  label?: string;
  initialValue?: {
    value: any;
    label: string;
  };
  onSelect?: (value: any) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  options: Value[];
  style?: any;
  error?: boolean;
}

const Selector = (props: SelectorProps) => {
  const { isLoading, isDisabled, initialValue, onSelect, options, style, error } = props;
  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#484848", "white");

  const [value, setValue] = useState<{
    value: string;
    label: string;
  } | undefined>(undefined)

  useEffect(() => {
    if (!value && initialValue) {
      setValue(initialValue)
    }
  }, [initialValue, isLoading])

  const handleInputChange = (newValue: SingleValue<{
    value: string;
    label: string;
  }>) => {
    if (newValue && newValue.value !== undefined) {
      setValue(newValue);
      if (onSelect) onSelect(newValue.value);
    }
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: style?.width
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
      styles={customStyles}
    />
  )
}

export default Selector;
