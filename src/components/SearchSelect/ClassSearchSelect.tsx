import Parse from 'parse';
import { useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import Select, { SingleValue, ActionMeta } from 'react-select';
import CreateSelect from 'react-select/creatable';
import { useQuery } from "react-query";
import { ClassNames } from '@app/shared/types';
import toJson from '../../utils/toJson';
import getters from '@app/shared/utils/getters';

interface ClassSearchSelectProps {
  style?: any;
  label?: string;
  initialValue?: any;
  objectClass: ClassNames;
  filters?: any[];
  valueGetter: (value: any) => string | undefined;
  labelGetter: (value: any) => string | undefined;
  onSelect: (value: any) => void;
  onCreate?: (value: any) => Promise<any>;
  onRemove?: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  queryName?: string;
  queryOpts?: any;
  additionalOptions?: any[];
  error?: boolean;
  isClearable?: boolean;
  autoSelectFirst?: boolean;
  isMulti?: boolean;
  isCreateable?: boolean;
  name: string;
  placeholder?: string;
}

interface Value {
  value: string;
  label: string;
}

function sortLabelAscending(a: Value, b: Value) {
  if (a.label < b.label) return -1;
  if (a.label > b.label) return 1;
  return 0;
}

const ClassSearchSelect = (props: ClassSearchSelectProps) => {
  const bgColor = useColorModeValue("white", "#1a202c");
  const textColor = useColorModeValue("#484848", "#718096");

  const {
    style,
    objectClass,
    onSelect,
    onClear,
    onRemove,
    initialValue,
    isLoading,
    disabled,
    filters,
    queryName,
    queryOpts,
    additionalOptions,
    error,
    isClearable,
    isMulti,
    isCreateable,
    placeholder,
  } = props;

  const { labelGetter, valueGetter } = getters(objectClass);

  const fetchItems = async () => {
    if (!objectClass) return [];
    const query = new Parse.Query(objectClass);
    if (filters) {
      filters.forEach(filter => {
        query[filter.method](filter.prop, filter.value);
      })
    }
    return query.findAll();
  }

  const ClassQuery = useQuery(queryName ? queryName : objectClass, () => fetchItems(), {
    ...queryOpts,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data } = ClassQuery;

  const items = useMemo(() => {
    return data?.map((item: any) => toJson(item)) || [];
  }, [data])

  const [value, setValue] = useState<Value | Value[]>();

  const onCreate = async (value: any) => {
    const object = new Parse.Object(objectClass);
    const prop = getters(objectClass).prop || 'value';
    object.set(prop, value);
    if (filters) {
      filters.forEach(filter => {
        object.set(filter.prop, filter.value);
      })
    }
    await object.save();
    ClassQuery.refetch();
    return object;
  }

  useEffect(() => {
    if (!data || data.length === 0) return;
    if (initialValue) {
      if (isMulti && Array.isArray(initialValue)) {
        setValue(initialValue.map(item => ({
          value: valueGetter(item),
          label: labelGetter(item)
        })));
      } else {
        const v = data && data.find(item => item.id === initialValue.objectId);
        if (v) {
          const vData = v.toJSON();
          setValue({
            value: valueGetter(vData),
            label: labelGetter(vData)
          });
        }
      }
    }
  }, [initialValue, data, isLoading, ClassQuery.isLoading]);

  const options = useMemo(() => {
    const o = items.map((item: any) => ({
      value: valueGetter(item),
      label: labelGetter(item),
    })).sort(sortLabelAscending);
    if (additionalOptions) {
      return [...o, ...additionalOptions]
    }
    return o;
  }, [data])

  const handleInputChange = (newValue: SingleValue<{
    value: string;
    label: string;
  }>, actionMeta: ActionMeta<{
    value: string;
    label: string;
  }>) => {
    const { action, removedValue } = actionMeta;

    if (action === 'clear') {
      if (onClear) onClear();
      setValue(undefined);
    } else if (isMulti && action === 'remove-value') {
      if (onRemove) onRemove(removedValue.value)
      setValue(newValue);
    } else {
      if (newValue) {
        if (newValue.value === 'OTHER') {
          onSelect({ id: 'OTHER', name: 'OTHER' })
          setValue(newValue)
        } else if (newValue.value === 'SELECT') {
          onSelect({ id: 'SELECT', name: 'SELECT' })
          setValue(newValue)
        } else {
          if (isMulti && Array.isArray(newValue)) {
            onSelect(newValue.map(val => data?.find((item: any) => item.id === val.value)));
          } else {
            const selected = data?.find((item: any) => {
              return item.id === newValue.value;
            });
            if (selected) {
              onSelect(selected);
            }
          }
          setValue(newValue);
        }
      }
    }
  };

  const handleOnCreateOption = (inputValue: string) => {
    if (onCreate) onCreate(inputValue).then((item) => {
      const itemData = item.toJSON();
      const newOption = {
        value: valueGetter(itemData),
        label: labelGetter(itemData)
      };
      if (isMulti) {
        if (Array.isArray(value)) {
          setValue([
            ...value,
            newOption
          ]);
        } else {
          setValue([
            newOption
          ]);
        }
      } else {
        setValue(newOption);
        if (onSelect) onSelect(item);
      }
    });
  };

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

  const SelectComponent = (isCreateable)
    ? CreateSelect
    : Select;

  return (
    <SelectComponent
      isLoading={isLoading || ClassQuery.isLoading}
      isDisabled={disabled || isLoading || ClassQuery.isLoading}
      defaultValue={value}
      value={value}
      options={options}
      onChange={handleInputChange}
      onCreateOption={handleOnCreateOption}
      styles={customStyles}
      isClearable={isClearable}
      isMulti={isMulti}
      placeholder={placeholder || `Select ${objectClass}`}
    />
  )
}

export default ClassSearchSelect;
