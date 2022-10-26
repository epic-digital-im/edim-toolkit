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
  select?: string[];
  isLive?: boolean;
}

export const useLiveQuery = ({
  initialState,
  objectClass,
  objectId,
  options,
  include,
  select,
  isLive
}: ParseLiveQueryOptions): UseQueryResult<any> => {
  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();

  const queryKey = initialState ? initialState.id : objectId;

  const ParseQuery = new Parse.Query(objectClass);

  if (select) {
    ParseQuery.select(select);
  }

  if (include) {
    ParseQuery.include(include);
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

  const qk = [queryKey, { include, select }];

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
          // console.log('create', item);
          queryClient.setQueriesData(qk, item);
        });
        subscription.on('update', (item) => {
          // console.log('update', item.id);
          queryClient.setQueriesData(qk, item)
        });
        subscription.on('delete', (item) => {
          // console.log('delete', item.id);
          queryClient.removeQueries(qk);
        });
        sub.current = subscription;
      } else {
        // console.log(sub.current.id)
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
  select?: string[];
  ascending?: string,
  descending?: string,
  isLive?: boolean;
  isLongPolling?: boolean;
  queryKey?: any[];
  query?: Parse.Query<Parse.Object<any>>;
  findAll?: boolean;
  limit?: number;
  skip?: number;
}

export const useLiveCollectionQuery = (props: LiveCollectionQueryOptions) => {
  const {
    objectClass,
    options,
    include,
    select,
    filter,
    ascending,
    descending,
    isLive,
    isLongPolling,
    query,
    findAll,
    limit,
    skip,
  } = props;

  if (props.queryKey && !Array.isArray(props.queryKey)) {
    throw new Error(`queryKey must be an array: ${props.queryKey}`);
  }

  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();
  const ParseQuery = query || new Parse.Query(objectClass);

  ParseQuery.withCount(true);

  if (limit !== undefined) {
    ParseQuery.limit(limit);
  }

  if (skip !== undefined) {
    ParseQuery.skip(skip);
  }

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

  if (select && select.length > 0) {
    ParseQuery.select(select);
  }

  if (include) {
    ParseQuery.include(include);
  }

  const fetchCollection = async () => {
    if (findAll) {
      return ParseQuery.findAll()
    } else {
      return ParseQuery.find()
    }
  };

  const queryKey = props.queryKey || [
    objectClass,
    {
      descending,
      ascending,
      filter,
      include,
      select,
      limit,
      skip,
    }
  ];

  const queryOptions = {
    ...o
  };

  if (isLive || isLongPolling) {
    queryOptions.staleTime = Infinity;
    queryOptions.refetchOnWindowFocus = false;
  }

  if (isLongPolling) {
    queryOptions.refetchInterval = 5000;
  }

  const q = useQuery(
    queryKey,
    () => fetchCollection(),
    queryOptions,
  );

  useEffect(() => {
    const subscribe = async () => {
      if (!sub.current) {
        try {
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
          subscription.on('open', console.log);
          subscription.on('close', console.log);
          sub.current = subscription;
        } catch (err) {
          console.log(err);
        }
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
  }, []);

  const data = q.data?.results || [];
  const count = q.data?.count;

  return {
    ...q,
    data,
    count,
  };
}

export default useLiveQuery;