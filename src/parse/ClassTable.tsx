import Parse from 'parse';
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ParseLiveQuery } from '../hoc/ParseLiveQuery';
import ClassSearchSelect from '../components/SearchSelect/ClassSearchSelect';
import WeekdaySelect from '../components/WeekDaySelector';
import Selector from '../components/Selector';
import { weekdayList, CanStates, Weekdays, ClassNames } from "@app/shared/types";
import { Attribute } from "@app/shared/parse-types";
import { NavLink, useHistory } from 'react-router-dom';
import { Icon, IconButton, Text, Flex, Button, Spinner, Input, Switch, useToast } from "@chakra-ui/react";

import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader";

import { FilterTable } from './FilterTable';

import { ParsePropUpdater } from "./PropUpdater";
import { SingleDatePickerParse } from '../forms/Fields/DatePickerField';

function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

const abbrevString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
}

export interface EditableAttributeCellProps {
  attributeName: string;
  objectClass: ClassNames;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isMulti?: boolean;
}

export const EditableAttributeCell = ({
  attributeName,
  objectClass,
  valueGetter,
  labelGetter,
  isMulti,
}: EditableAttributeCellProps) => ({
  row: { original },
  column: { id },
}) => {
    const initialValue = original._object.get(id);
    const [initialData, setInitialData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
      if (isMulti && initialValue) {
        setIsLoading(true);
        initialValue?.query().find()
          .then((result: any) => {
            setIsLoading(false);
            setError(undefined);
            if (result) {
              setInitialData(result.map((r: Parse.Object<any>) => r.toJSON()));
            }
          })
          .catch((err: any) => {
            setIsLoading(false);
            setError(err);
          })
      } else {
        const iv = initialValue?.toJSON();
        if (iv) {
          setInitialData(iv);
        }
      }
    }, [isMulti, initialValue]);

    const handleUpdate = async (value: any) => {
      console.log('handleUpdate', value);
      const object: Attribute = original._object;
      setIsLoading(true);
      if (isMulti) {
        if (value[0] !== undefined) {
          object.relation(id).add(value);
        }
      } else {
        object.set(id, value);
      }
      await object.save();
      setIsLoading(false);
    }

    const handleClear = async () => {
      console.log('handleClear');
      const object = original._object;
      setIsLoading(true);
      if (isMulti) {
        const items = await object.relation(id).query().find();
        items.forEach((item: Attribute) => {
          object.relation(id).remove(item);
        });
      } else {
        object.set(id, null);
      }
      await object.save();
      setIsLoading(false);
      setInitialData(undefined);
    }

    const handleRemove = async (objectId: string) => {
      console.log('handleRemove', objectId);
      const object = original._object;
      setIsLoading(true);
      const options = await object.relation(id).query().find();
      const removed = options.filter((o: Attribute) => o.id === objectId);
      object.relation(id).remove(removed);
      await object.save();
      setIsLoading(false);
    }

    const handleCreate = async (value: string) => {
      console.log('handleCreate', value);
      const object = original._object;
      setIsLoading(true);
      const AttributeClass = Parse.Object.extend(objectClass);
      const attribute = new AttributeClass();
      attribute.set('name', id);
      attribute.set('value', value);
      await attribute.save();
      if (isMulti) {
        object.relation(id).add(attribute);
      } else {
        object.set(id, attribute);
      }
      await object.save();

      if (isMulti) {
        const options = await object.relation(id).query().find();
        setInitialData(options.map((r: Parse.Object<any>) => r.toJSON()));
      } else {
        setInitialData(attribute?.toJSON());
      }

      setIsLoading(false);
      return attribute;
    }

    return (
      <div style={{ width: '90%', zIndex: 1000 }}>
        <ClassSearchSelect
          isLoading={isLoading}
          disabled={isLoading}
          style={{ width: '100%' }}
          objectClass={objectClass}
          initialValue={initialData}
          valueGetter={valueGetter}
          labelGetter={labelGetter}
          onSelect={handleUpdate}
          onCreate={handleCreate}
          onRemove={handleRemove}
          onClear={handleClear}
          isCreateable
          queryName={[objectClass, attributeName]}
          isMulti={isMulti}
          filters={[
            {
              prop: 'name',
              method: 'equalTo',
              value: attributeName,
            }
          ]}
        />
      </div>
    )
  }

// Create an editable cell renderer
export const EditableNumberCell = ({
  value: initialValue,
  row: { original },
  column, // This is a custom function that we supplied to our table instance
}) => {
  const { id, editable } = column;
  const [local, setLocal] = useState(initialValue);

  const handleChange = (e: { target: { value: string } }) => {
    setLocal(e.target.value)
  }

  useEffect(() => {
    setLocal(initialValue)
  }, [initialValue]);

  return (
    <ParsePropUpdater object={original._object} property={id}>
      {({ onChange, value, isLoading }) => {
        const onBlur = () => {
          if (local !== value) {
            const val = parseFloat(local);
            if (!isNaN(val)) {
              onChange(val);
            }
          }
        }

        useEffect(() => {
          setLocal(value)
        }, [value])

        return (
          <Input
            isDisabled={!editable || isLoading}
            borderRadius={0}
            borderColor="transparent"
            value={local}
            onChange={handleChange}
            onBlur={onBlur}
            background={'transparent'}
            textAlign={'center'}
            padding={'0'}
            margin={'0'}
            height={'45px'}
            fontSize={'sm'}
            type={'text'}
          />
        )
      }}
    </ParsePropUpdater>
  )
}


export const EditableColorPicker = ({
  value: initialValue,
  row: { original },
  column, // This is a custom function that we supplied to our table instance
}) => {
  const { id, editable } = column;
  const toast = useToast();
  const [value, setValue] = useState(initialValue);
  const [prevValue, setPrevValue] = useState(initialValue);

  const debouncedSearchTerm = useDebounce(value, 500);

  useEffect(() => {
    handleUpdate();
  }, [debouncedSearchTerm])

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.value !== value) {
      setValue(e.target.value);
    }
  }

  const handleUpdate = () => {
    const object = original._object;
    if (object.get(id) === debouncedSearchTerm) return;
    setIsLoading(true);
    setPrevValue(value);
    object.set(id, value || '');
    object.save().then(() => {
      setIsLoading(false);
      toast({
        title: `${id} updated`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }).catch((e) => {
      setIsLoading(false);
      setValue(prevValue);
      toast({
        title: `ERROR: ${e.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    });
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return initialValue || null;
  }

  return (
    <Input
      isDisabled={isLoading}
      borderRadius={0}
      borderColor="transparent"
      value={value}
      onChange={handleChange}
      background={'transparent'}
      textAlign={'center'}
      padding={'0'}
      margin={'0'}
      height={'45px'}
      fontSize={'sm'}
      type="color"
    />
  )
}


// Create an editable cell renderer
export const EditableCell = ({
  value: initialValue,
  row: { original },
  column, // This is a custom function that we supplied to our table instance
}) => {
  const { id, editable } = column;
  const [local, setLocal] = useState(initialValue);

  const handleChange = (e: { target: { value: string } }) => {
    setLocal(e.target.value)
  }

  useEffect(() => {
    setLocal(initialValue)
  }, [initialValue]);

  return (
    <ParsePropUpdater object={original._object} property={id}>
      {({ onChange, value, isLoading }) => {
        const onBlur = () => {
          if (local !== value) {
            onChange(local);
          }
        }

        useEffect(() => {
          setLocal(value)
        }, [value])

        return (
          <Input
            isDisabled={!editable || isLoading}
            borderRadius={0}
            borderColor="transparent"
            value={local}
            onChange={handleChange}
            onBlur={onBlur}
            background={'transparent'}
            textAlign={'center'}
            padding={'0'}
            margin={'0'}
            height={'45px'}
            fontSize={'sm'}
          />
        )
      }}
    </ParsePropUpdater>
  )
}

export const EditableDateCell = ({ cell, row: { original }, column }) => {
  if (!column.editable) {
    const d = original._object.get(column.id);
    if (!d) return null;
    return d.toLocaleDateString();
  }
  return (
    <SingleDatePickerParse
      property={column.id}
      object={original._object}
    />
  )
}

export const EditableBooleanCell = ({
  value: initialValue,
  row: { original },
  column: { id, editable, },
}) => {
  const toast = useToast();
  const [value, setValue] = useState(Boolean(initialValue));
  const [prevValue, setPrevValue] = useState(Boolean(initialValue));

  const handleUpdate = () => {
    const object = original._object;
    const updatedValue = !value;
    setIsLoading(true);
    object.set(id, updatedValue);
    object.save()
      .then(() => {
        setIsLoading(false);
        setValue(updatedValue);
        toast({
          title: `${id} updated`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }).catch((e) => {
        setIsLoading(false);
        setValue(prevValue);
        toast({
          title: `ERROR: ${e.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }

  const onChange = () => {
    handleUpdate();
  }

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return value ? 'Yes' : 'No'
  }

  return (
    <Switch
      isDisabled={isLoading}
      isChecked={value}
      onChange={onChange}
    />
  )
}

export const RelationCell = ({ objectClass, objectId, Cell }: { objectClass: string, objectId: string, Cell: any }) => {
  return (
    <ParseLiveQuery objectClass={objectClass} objectId={objectId}>
      {({ data, isLoading }) => {
        if (isLoading) {
          return (
            <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'}>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='md'
              />
            </Flex>
          );
        }
        return (
          <Cell data={data} />
        )
      }}
    </ParseLiveQuery>
  );
}

export const RelationButtonRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
    isAdmin,
    isPropertyDetail,
  } = props;

  const object = original._object.get(id);
  const classRoute = object?.className.toLowerCase();
  const objectData = object?.toJSON() || {};

  if (!objectData.objectId) return null;

  const label = abbrevString(objectData.name, 30);

  return (isPropertyDetail)
    ? (
      <Text>{label}</Text>
    )
    : (
      <div style={{ width: '90%', zIndex: 1000 }}>
        <NavLink to={isAdmin ? `/admin/${classRoute}/${objectData.objectId}` : `/customer/${classRoute}/${objectData.objectId}`}>
          <Button width="100%">
            {label}
          </Button>
        </NavLink>
      </div>
    )
};

export const ParseButtonRenderer = (props: any) => {
  const {
    value,
    row: { original },
    isAdmin,
  } = props;
  const object = original._object;
  const classRoute = object.className.toLowerCase();

  return <div style={{ width: '90%', zIndex: 1000 }}>
    <NavLink to={isAdmin ? `/admin/${classRoute}/${original.objectId}` : `/customer/${classRoute}/${original.objectId}`}>
      <Button width="100%">
        {value}
      </Button>
    </NavLink>
  </div>
};

export const ParseCellRenderer = (props: any) => {
  const {
    value,
  } = props;
  return <Text>{value}</Text>
};

export const ParseStripePlanRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const plan = original._object.get(id);
  const plan_id = plan?.id;
  const [planData, setPlanData] = useState<StripePlan | undefined>();
  const [loading, setLoading] = useState(false);
  const StripePlanClass = Parse.Object.extend(ClassNames.StripePlan);

  const loadPlan = async () => {
    const query = new Parse.Query(StripePlanClass);
    query.equalTo('plan_id', plan_id);
    const planObj = await query.first() as StripePlan;
    setPlanData(planObj);
  }

  useEffect(() => {
    loadPlan();
  }, [plan_id]);

  if (loading) {
    return null;
  }
  if (planData) {
    return <Text>{planData.get('nickname')}</Text>
  }
  return <Text>Plan</Text>
};

export const ParseStripeAmountRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  return <Text>{val ? `$${val / 100}` : ''}</Text>
};

export const ParseStripeDateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  if (!val) return null;
  const date = new Date(original._object.get(id) * 1000);
  return <Text>{date && date.toLocaleString()}</Text>
};

export const ParseDateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  const val = original._object.get(id);
  if (!val) return null;
  const date = new Date(original._object.get(id));
  return <Text>{date && date.toLocaleString()}</Text>
};

export const CanStateCellRenderer = (props: any) => {
  const {
    row: { original },
    column: { id },
  } = props;
  return <Text fontSize="sm">{CanStates[original._object.get(id)]}</Text>
};

interface EditableRelationCellProps {
  objectClass: ClassNames;
  valueGetter: (data: any) => string;
  labelGetter: (data: any) => string;
  isClearable?: boolean;
}

export const EditableRelationCell = ({
  objectClass,
  valueGetter,
  labelGetter,
  isClearable,
}: EditableRelationCellProps) => ({
  row: { original },
  column: { id },
}) => {
    const initialValue = original._object.get(id);
    const initialData = initialValue?.toJSON();

    return (
      <Flex width={'100%'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
        <ParsePropUpdater object={original._object} property={id}>
          {({ onChange, value, isLoading }) => {
            const handleClear = () => {
              onChange(null);
            }
            return (
              <ClassSearchSelect
                isClearable={isClearable}
                isLoading={isLoading}
                disabled={isLoading}
                style={{ width: '100%' }}
                objectClass={objectClass}
                queryName={objectClass}
                initialValue={initialData}
                valueGetter={valueGetter}
                labelGetter={labelGetter}
                onSelect={onChange}
                onClear={handleClear}
                isCreateable
              />
            )
          }}
        </ParsePropUpdater>
      </Flex>
    )
  }

export const StatusRenderer = (StatusList: any[]) => ({
  value: initialValue,
  row: { original },
  column: { id, editable }, // This is a custom function that we supplied to our table instance
}) => {


  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = (value: Weekdays) => {
    const object = original._object;
    const statusId = StatusList.indexOf(value);
    if (statusId > -1) {
      setIsLoading(true);
      object.set(id, statusId);
      object.save().then(() => {
        setIsLoading(false);
      })
    }
  }

  // If the initialValue is changed externall, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return StatusList[value]
  }

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
      <Selector
        isDisabled={isLoading}
        isLoading={isLoading}
        initialValue={{
          value: StatusList[value],
          label: StatusList[value]
        }}
        onSelect={handleUpdateTask}
        options={StatusList.map((value: string) => ({
          value: value,
          label: value
        }))}
      />
    </div>
  )
}

export const EditableWeekdayCell = ({
  value: initialValue,
  row: { original },
  column: { id, editable, }, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateTask = (value: Weekdays) => {
    const object = original._object;
    const dayId = weekdayList.indexOf(value);
    if (dayId > -1) {
      setIsLoading(true);
      object.set(id, dayId);
      object.save().then(() => {
        setIsLoading(false);
      })
    }
  }

  // If the initialValue is changed externall, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return weekdayList[value] || null;
  }

  return (
    <div style={{ width: '90%', zIndex: 1000 }}>
      <WeekdaySelect
        isDisabled={isLoading}
        isLoading={isLoading}
        initialValue={{
          value: weekdayList[value],
          label: weekdayList[value]
        }}
        onSelect={handleUpdateTask}
      />
    </div>
  )
}


export interface ClassTableProps {
  history: any;
  objectClass: string;
  columnsData: any[];
  columnStyle: any;
  initialState?: any | undefined;
  showFilters?: boolean | undefined;
  title?: string | undefined;
  renderRowCard?: (row: any, index: number, initialState: any, onEdit: (item: Parse.Object<Parse.Attributes>) => void, onDelete: (item: Parse.Object<Parse.Attributes>) => void) => React.ReactNode | undefined;
  renderForm?: (initialValues: any, onClose?: () => void, refetch?: () => void) => React.ReactNode | undefined;
  renderHeader?: () => React.ReactNode | undefined;
  renderFilters?: () => React.ReactNode | undefined;
  renderMap?: () => React.ReactNode | undefined;
  query?: Parse.Query | undefined;
  queryKey: string;
  isAdmin?: boolean | undefined;
  isPropertyDetail?: boolean | undefined;
  fetchAll?: boolean | undefined;
  inactive?: boolean | undefined;
  hidePaging?: boolean | undefined;
  hideSearch?: boolean | undefined;
  onColumnOrderChange?: (newOrder: string[]) => void;
}

export const ClassTable: React.FC<ClassTableProps> = (props) => {
  const {
    objectClass,
    renderHeader,
    query,
    queryKey,
    fetchAll,
    initialState,
    ...tableProps
  } = props;

  const { dupes, ...tableState } = initialState || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();

  const tableQuery = query || new Parse.Query(objectClass);
  const loadData = async (): Promise<Parse.Object<Parse.Attributes>[]> => fetchAll ? tableQuery.findAll() : tableQuery.find();
  const key = queryKey || objectClass;

  const ParseQuery = useQuery(key, () => loadData(), {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const isLoading = ParseQuery.isLoading;

  const tableData = useMemo(() => {
    if (ParseQuery.isLoading) return [];
    const data = ParseQuery.data || [];
    const tableData = data.map((item) => {
      const raw = item.toJSON();
      return {
        ...raw,
        _object: item,
      }
    });
    if (dupes && objectClass === ClassNames.Property) {
      return tableData.filter((d) => {
        const matches = tableData.filter((dd) => dd.place_id === d.place_id);
        return matches && matches.length > 1;
      }).sort((a, b) => {
        return a.place_id > b.place_id ? 1 : -1;
      })
    }
    return tableData;
  }, [queryKey, ParseQuery.data, dupes]);


  useEffect(() => {
    ParseQuery.refetch();
  }, [query, queryKey])

  useEffect(() => {
    // subscribe();
    return () => {
      sub.current?.unsubscribe();
    }
  }, []);

  return (
    <Card p="0">
      {renderHeader && <CardHeader p="12px 5px">
        {renderHeader()}
      </CardHeader>}
      <CardBody pb="1.5rem">
        <FilterTable
          {...tableProps}
          initialState={tableState}
          queryKey={queryKey}
          tableData={tableData}
          isLoading={isLoading}
          refetch={ParseQuery.refetch}
          objectType={objectClass}
        />
      </CardBody>
    </Card>
  );
}
