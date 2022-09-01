import { UseQueryResult } from '@tanstack/react-query';

import {
  useLiveQuery,
  useLiveCollectionQuery,
  ParseLiveQueryOptions,
  LiveCollectionQueryOptions
} from '../hooks';

export interface ParseLiveQueryProps extends ParseLiveQueryOptions {
  children: (data: UseQueryResult<any>) => JSX.Element | null;
}

export const ParseLiveQuery = ({ children, ...options }: ParseLiveQueryProps) => {
  const query = useLiveQuery(options);
  return children(query);
}

interface ParseCollectionLiveQueryProps extends LiveCollectionQueryOptions {
  children: (data: UseQueryResult<any>) => JSX.Element | null;
}

export const ParseCollectionLiveQuery = ({ children, ...options }: ParseCollectionLiveQueryProps) => {
  const query = useLiveCollectionQuery(options);
  return children(query);
}
