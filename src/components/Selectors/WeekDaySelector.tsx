import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { weekdayList } from '@app/shared/types';

interface WeekDaySelectorProps {
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

const WeekDaySelector = (props: WeekDaySelectorProps) => {
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
    container: (provided, state) => ({
      ...provided,
      width: style?.width,
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

export default WeekDaySelector;
