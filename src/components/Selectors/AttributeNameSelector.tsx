import { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { attributeNameList } from '@app/shared/types';

interface AttributeNameSelectorProps {
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

const captializeString = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const AttributeNameSelector = (props: AttributeNameSelectorProps) => {
  const { isLoading, isDisabled, initialValue, onSelect, isClearable, style } = props;

  const [value, setValue] = useState<{
    value: string;
    label: string;
  } | undefined>(initialValue || { value: attributeNameList[0], label: captializeString(attributeNameList[0]) })

  const [options, setOptions] = useState<{ value: any; label: string; }[]>([])

  useEffect(() => {
    let options = attributeNameList.map((AttributeName: string) => ({
      value: AttributeName,
      label: captializeString(AttributeName),
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
      setValue(undefined);
      if (onSelect) onSelect(null)
    }
  };

  const error = false;

  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      width: style?.width,
      zIndex: 100,
    }),
    control: (provided, state) => ({
      ...provided,
      width: style?.width,
      borderColor: (error) ? 'red' : null,
      zIndex: 100,
    }),
    menu: (provided, state) => ({
      ...provided,
      zIndex: 1000,
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
      placeholder="Select a Attribute"
    />
  )
}

export default AttributeNameSelector;
