import React, { useRef, useEffect } from "react";
import Parse from 'parse/dist/parse.min.js';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface Filter {
  method: string;
  value: any;
  prop: string;
}

export interface ParseLiveQueryOptions {
  initialState?: any;
  objectClass?: string;
  objectId: string;
  options?: Omit<UseQueryOptions<unknown, unknown, unknown, string>, "queryKey" | "queryFn"> | undefined;
  include?: string[];
  isLive?: boolean;
}

export const useLiveQuery = ({
  initialState,
  objectClass,
  objectId,
  options,
  include,
  isLive
}: ParseLiveQueryOptions): UseQueryResult<any> => {
  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();

  const queryKey = initialState ? initialState.id : objectId;

  const ParseQuery = new Parse.Query(objectClass);

  if (include) {
    for (const includeItem of include) {
      ParseQuery.include(includeItem);
    }
  }

  const fetchObject = async () => {
    if (initialState) return initialState;
    return ParseQuery.get(objectId)
  }

  const queryOptions = {
    enabled: Boolean(queryKey),
    ...o,
  }

  if (isLive) {
    queryOptions.staleTime = Infinity;
    queryOptions.refetchOnWindowFocus = false;
  }

  const qk = [queryKey, { include }];

  const query = useQuery(
    qk,
    () => fetchObject(),
    queryOptions,
  )

  useEffect(() => {
    const subscribe = async () => {
      if (!sub.current) {
        const subscription = await ParseQuery.subscribe();
        subscription.on('create', (item) => {
          console.log('create', item);
          queryClient.setQueriesData(qk, item);
        });
        subscription.on('update', (item) => {
          console.log('update', item.id);
          queryClient.setQueriesData(qk, item)
        });
        subscription.on('delete', (item) => {
          console.log('delete', item.id);
          queryClient.removeQueries(qk);
        });
        sub.current = subscription;
      } else {
        console.log(sub.current.id)
      }
    }
    if (isLive) {
      subscribe();
    }
    return () => {
      if (sub.current) {
        sub.current?.unsubscribe();
      }
    }
  }, [])
  return query
}

export interface LiveCollectionQueryOptions {
  objectClass: string;
  options?: Omit<UseQueryOptions<unknown, unknown, unknown, string>, "queryKey" | "queryFn"> | undefined;
  include?: string[];
  filter?: Filter[];
  ascending?: string,
  descending?: string,
  isLive?: boolean;
  queryKey?: any[];
  query?: Parse.Query<Parse.Object<any>>;
  findAll?: boolean;
}

export const useLiveCollectionQuery = (props: LiveCollectionQueryOptions) => {
  const {
    objectClass,
    options,
    include,
    filter,
    ascending,
    descending,
    isLive,
    query,
    findAll,
  } = props;

  if (props.queryKey && !Array.isArray(props.queryKey)) {
    throw new Error(`queryKey must be an array: ${props.queryKey}`);
  }

  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();
  console.log(query, objectClass)
  const ParseQuery = query || new Parse.Query(objectClass);

  if (ascending) {
    ParseQuery.ascending(ascending);
  }

  if (descending) {
    ParseQuery.descending(descending);
  }

  if (filter) {
    for (const filterItem of filter) {
      ParseQuery[filterItem.method](filterItem.prop, filterItem.value);
    }
  }

  if (include) {
    for (var i = 0; i < include.length; i++) {
      ParseQuery.include(include[i]);
    }
  }

  const fetchCollection = async () => {
    if (!findAll || ascending) {
      console.log(ParseQuery)
      return ParseQuery.find()
    } else {
      return ParseQuery.findAll()
    }
  }

  const queryKey = props.queryKey || [
    objectClass,
    {
      descending,
      ascending,
      filter,
      include,
    }
  ]

  const queryOptions = {
    ...o
  }

  if (isLive) {
    queryOptions.staleTime = Infinity;
    queryOptions.refetchOnWindowFocus = false;
  }

  const q = useQuery(
    queryKey,
    () => fetchCollection(),
    queryOptions,
  );

  useEffect(() => {
    const subscribe = async () => {
      if (!sub.current) {
        const subscription = await ParseQuery.subscribe();
        subscription.on('create', (item) => {
          queryClient.setQueriesData(queryKey, (oldData) => {
            if (Array.isArray(oldData)) {
              return [...oldData, item];
            }
            return [item];
          });
        });
        subscription.on('update', (item) => {
          queryClient.setQueriesData(queryKey, (oldData) => {
            const update = (oldItem: any) => oldItem.id === item.id ? item : oldItem;
            if (Array.isArray(oldData)) {
              return oldData.map(update);
            }
            return item;
          })
        });
        subscription.on('delete', (item) => {
          queryClient.setQueriesData(queryKey, (oldData) => {
            const update = (oldItem: any) => oldItem.id !== item.id;
            if (Array.isArray(oldData)) {
              return oldData.filter(update);
            }
            return [];
          });
        });
        sub.current = subscription;
      } else {
        console.log(sub.current.id);
      }
    }
    if (isLive) {
      subscribe();
    }
    return () => {
      sub.current?.unsubscribe();
    }
  }, [])
  return q;
}

export default useLiveQuery;