import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

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
    if (newValue && newValue.value) {
      setValue(newValue);
      if (onSelect) onSelect(newValue.value);
    }
  };

  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      width: style?.width,
      margin: 0,
    }),
    control: (provided, state) => ({
      ...provided,
      width: style?.width,
      borderColor: (error) ? 'red' : null,
      margin: 0,
    }),
    menu: (provided, state) => ({
      ...provided,
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
