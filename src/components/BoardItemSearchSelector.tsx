import React, { useEffect, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react'
import Select, { SingleValue, ActionMeta } from 'react-select';
import { useQuery } from "react-query";

import { useContainer as useRoutes } from '../store/routes';
import { Route } from '@app/shared/types';

import { fetchRoutes } from "../services/serviceApi";

interface BoardItemSearchSelectorProps {
  initialValue?: {
    value: string;
    label: string;
  };
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

const BoardItemSearchSelector = (props: BoardItemSearchSelectorProps) => {
  const { route, handleSelectRoute } = useRoutes();
  const { initialValue } = props;

  const { data, isLoading, isError } = useQuery("routes", () => fetchRoutes(), {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const routes = data || [];

  const [value, setValue] = useState<{
    value: string;
    label: string;
  }>(initialValue || {
    value: 'ALL',
    label: 'ALL',
  })

  const options = routes.map((route: Route) => {
    const routeId = route.id?.toString() || '';
    return {
      value: routeId,
      label: route.name,
    }
  }).sort(sortLabelAscending);

  const handleInputChange = (newValue: SingleValue<{
    value: string;
    label: string;
  }>, actionMeta: ActionMeta<{
    value: string;
    label: string;
  }>) => {
    if (newValue && newValue.value) {
      if (newValue.value === 'ALL') {
        handleSelectRoute({ id: 'ALL', name: 'ALL' })
        setValue(newValue)
      }
      const selectedRoute = routes.find((route: Route) => {
        return route.id === parseInt(newValue.value);
      });
      if (selectedRoute) {
        handleSelectRoute(selectedRoute);
        setValue(newValue);
      }
    }
  };

  return (
    <Select
      defaultValue={value}
      value={value}
      options={[{ label: 'ALL', value: 'ALL' }, ...options]}
      onChange={handleInputChange}
    />
  )
}

export default BoardItemSearchSelector;
