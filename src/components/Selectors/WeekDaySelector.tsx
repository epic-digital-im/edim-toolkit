import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { weekdayList } from '@app/shared/types';
import { useColorModeValue } from '@chakra-ui/react';

interface WeekdaySelectorProps {
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

export const WeekdaySelector = (props: WeekdaySelectorProps) => {
  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#484848", "#718096");
  const { isLoading, isDisabled, initialValue, onSelect, isClearable, style } = props;

  const [value, setValue] = useState<{
    value: string;
    label: string;
  }>(initialValue)

  const [options, setOptions] = useState<{ value: null; label: string; }[]>([])

  useEffect(() => {
    let options = weekdayList.map(weekday => ({
      value: weekday,
      label: weekday,
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
    <Select
      isDisabled={isDisabled}
      isLoading={isLoading}
      value={value}
      defaultValue={value}
      options={options}
      onChange={handleInputChange}
      isClearable={isClearable}
      styles={customStyles}
      placeholder="Select a Weekday"
    />
  )
}

export default WeekdaySelector;
