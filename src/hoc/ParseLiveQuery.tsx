import Parse from 'parse';
import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from 'react-query';
import { useRef, useEffect } from "react";

export interface ParseLiveQueryProps {
  initialState?: any;
  objectClass?: string;
  objectId: string;
  options?: Omit<UseQueryOptions<unknown, unknown, unknown, string>, "queryKey" | "queryFn"> | undefined;
  children: (data: UseQueryResult<any>) => JSX.Element | null;
  include?: string[];
  filters?: any;
  enableLive?: boolean;
}

export const ParseLiveQuery = ({
  initialState,
  objectClass,
  objectId,
  options,
  children,
  include,
  filters,
  enableLive
}: ParseLiveQueryProps) => {
  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();

  let queryKey = initialState ? initialState.id : objectId;

  const ParseQuery = new Parse.Query(objectClass);

  if (include) {
    for (const includeItem of include) {
      ParseQuery.include(includeItem);
      queryKey += `-${includeItem}`;
    }
  }

  const fetchObject = async () => {
    if (initialState) return initialState;
    return ParseQuery.get(objectId)
  }

  const query = useQuery(
    queryKey,
    () => fetchObject(),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      ...o,
    },
  )

  useEffect(() => {
    const subscribe = async () => {
      if (!sub.current) {
        const subscription = await ParseQuery.subscribe();
        subscription.on('create', (item) => {
          console.log('create', item);
          queryClient.setQueriesData(queryKey, item);
        });
        subscription.on('update', (item) => {
          console.log('update', item.id);
          queryClient.setQueriesData(queryKey, item)
        });
        subscription.on('delete', (item) => {
          console.log('delete', item.id);
          queryClient.removeQueries(queryKey);
        });
        sub.current = subscription;
      } else {
        console.log(sub.current.id)
      }
    }
    if (enableLive) {
      subscribe();
    }
    return () => {
      if (sub.current) {
        sub.current?.unsubscribe();
      }
    }
  }, [])
  return children(query);
}

interface Filter {
  method: string;
  value: any;
  prop: string;
}

interface ParseCollectionLiveQueryProps {
  objectClass: string;
  options?: Omit<UseQueryOptions<unknown, unknown, unknown, string>, "queryKey" | "queryFn"> | undefined;
  children: (data: UseQueryResult<any>) => JSX.Element | null;
  include?: string[];
  filter?: Filter[];
  ascending?: string,
}

export const ParseCollectionLiveQuery = ({
  objectClass,
  options,
  children,
  include,
  filter,
  ascending,
}: ParseCollectionLiveQueryProps) => {
  const o = options || {};
  const queryClient = useQueryClient()
  const sub = useRef<Parse.LiveQuerySubscription | undefined>();
  const ParseQuery = new Parse.Query(objectClass);

  if (ascending) {
    ParseQuery.ascending(ascending);
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

  const fetchObject = async () => {
    if (ascending) {
      return ParseQuery.find()
    } else {
      return ParseQuery.findAll()
    }
  }

  const query = useQuery(
    [
      objectClass,
      {
        ascending,
        filter,
        include,
      }
    ],
    () => fetchObject(),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      ...o,
    },
  )

  useEffect(() => {
    const subscribe = async () => {
      if (!sub.current) {
        const subscription = await ParseQuery.subscribe();
        subscription.on('create', (item) => {
          console.log('create', item);
          queryClient.setQueriesData(queryKey, item);
          queryClient.setQueriesData(objectClass, (oldData) => {
            if (Array.isArray(oldData)) {
              return [...oldData, item];
            }
            return [item];
          });
        });
        subscription.on('update', (item) => {
          console.log('update', item.id);
          queryClient.setQueriesData(queryKey, item)
          queryClient.setQueriesData(objectClass, (oldData) => {
            console.log(Array.isArray(oldData), oldData.length);
            const update = (oldItem: any) => oldItem.id === item.id ? item : oldItem;
            if (Array.isArray(oldData)) {
              return oldData.map(update);
            }
            return item;
          })
        });
        subscription.on('delete', (item) => {
          console.log('delete', item.id);
          queryClient.removeQueries(queryKey);
          queryClient.setQueriesData(objectClass, (oldData) => {
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
    // subscribe();
    return () => {
      sub.current?.unsubscribe();
    }
  }, [])
  return children(query);
}