import { SchemaConfig } from '@app/shared/parse-types';
import { useQuery } from '@tanstack/react-query';
import FetchGraphQL from '../../utils/relay';
import { UsePaginationState } from './usePagination';
import getters from '@app/shared/utils/getters';
import { useMemo } from 'react';

const getQueryFields = (select: string[], scheme: Parse.Schema) => {
  console.log({
    select,
    scheme,
  })
  return select?.reduce((acc, field, index) => {
    const f = scheme.fields[field];
    if (!field) return acc;
    if (field === 'ACL') {
      acc += `ACL {
        users {
          userId
          read
          write
        }
        roles {
          roleName
          read
          write
        }
        public {
          write
          read
        }
      }\n`
    } else if (f.type === 'Pointer') {
      const getter = getters(f.targetClass);
      if (getter && getter.labelProp) {
        acc += `${field} {
        objectId
        ${getter.labelProp}
      }\n`
      }
    } else if (f.type === 'Relation') {
      const getter = getters(f.targetClass);
      if (getter && getter.labelProp) {
        acc += `${field} {
        edges {
          node {
            objectId
            ${getter.labelProp}
          }
        }
      }\n`
      }
    } else {
      acc += `${field}`;
      if (index < select.length - 1) {
        acc += `\n`;
      }
    }
    return acc;
  }, ``) || ''
}

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

interface UseGraphqlQueryProps {
  objectClass: string;
  select: string[];
  include: string[];
  pagination: UsePaginationState;
  schema: Parse.Schema;
  config: SchemaConfig;
  options: {
    enabled: boolean;
  }
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

interface ResponseData {
  count: number;
  pageInfo: PageInfo;
  refetch: () => void;
  data: any[];
  isLoading: boolean;
}

const useGraphqlQuery = ({ objectClass, select, schema, config, include, pagination, options }: UseGraphqlQueryProps): ResponseData => {
  console.log({
    variables:
    {
      limit: pagination.pageSize,
      skip: pagination.pageIndex * pagination.pageSize,
    },
    queryOptions: {}
  })

  const qk = [objectClass, { include, select }];

  const GraphQLQuery = useQuery(
    qk,
    () => FetchGraphQL(
      `
  query ${objectClass}Query(
    $where: ${objectClass}WhereInput
    $order: [${objectClass}Order!]
    $skip: Int
    $after: String
    $first: Int
    $before: String
    $last: Int
    $options: ReadOptionsInput
    ) {
        ${camelize(objectClass)}s(
        where: $where, 
        order:$order, 
        skip: $skip, 
        after: $after,
        first: $first,
        before:$before,
        last:$last,
        options: $options,
      ) {
        count
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges{
          node{
            ${getQueryFields(select, schema)}
          }
          cursor
        }
      }
    }
    `,
      {
        variables: {
          limit: pagination.pageSize,
          skip: pagination.pageIndex * pagination.pageSize,
        },
        queryOptions: {}
      }),
    options
  );

  // return useMemo<ResponseData>(() => {

  // }, [GraphQLQuery.data, pagination]);
  const getEdges = (item) => item?.edges?.map((edge: any) => {
    const n = { ...edge.node };
    Object.keys(n).forEach((key) => {
      if (n[key] && n[key].edges) {
        n[key] = getEdges(n[key]);
      }
    })
    return n;
  }) || [];

  const responseData = GraphQLQuery.data?.data?.[camelize(objectClass) + 's'];
  const data = getEdges(responseData);
  const pageInfo = responseData?.pageInfo as PageInfo;
  const count = responseData?.count;

  return {
    refetch: GraphQLQuery.refetch,
    isLoading: GraphQLQuery.isLoading,
    pageInfo,
    data,
    count,
  };
}

export default useGraphqlQuery;