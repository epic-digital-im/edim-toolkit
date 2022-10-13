import Parse from 'parse/dist/parse.min.js';
import React, { useMemo } from "react";

import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader";

import { FilterTable } from './FilterTable';

import { ParseCollectionLiveQuery } from '../hoc/ParseLiveQuery';

import getters from '@app/shared/utils/getters'

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
  queryKey?: any[] | undefined;
  isAdmin?: boolean | undefined;
  isPropertyDetail?: boolean | undefined;
  findAll?: boolean | undefined;
  inactive?: boolean | undefined;
  hidePaging?: boolean | undefined;
  hideSearch?: boolean | undefined;
  onColumnOrderChange?: (newOrder: string[]) => void;
  isLive?: boolean | undefined;
  include?: string[] | undefined;
  filter?: any | undefined;
  exportData?: () => void;
  handleCreateNew?: (props: { refetch: () => void }) => () => Promise<any>;
}

export const ClassTable: React.FC<ClassTableProps> = (props) => {

  const {
    objectClass,
    renderHeader,
    query,
    queryKey,
    findAll,
    initialState,
    isLive,
    include,
    filter,
    exportData,
    ...tableProps
  } = props;

  const { dupes, ...tableState } = initialState || {};

  const getter = getters(objectClass);

  return (
    <ParseCollectionLiveQuery
      objectClass={objectClass}
      query={query}
      queryKey={queryKey}
      findAll={findAll}
      isLive={isLive}
      include={include}
      filter={filter}
      options={{
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      }}
    >
      {({ data, isLoading, refetch, isError }) => {

        const handleCreateNew = async () => {
          const item = new Parse.Object(objectClass);
          item.set(getter.prop, 'New Item');
          await item.save();
          refetch();
        }

        const tableData = useMemo(() => {
          if (isLoading) return [];
          const d = data || [];
          const tableData = d.map((item) => {
            let raw = item.toJSON();
            raw = Object.keys(raw).reduce((acc, key) => {
              const v = raw[key];
              if (v && v.value) {
                acc[key] = v.value;
              } else if (v && v.iso) {
                acc[key] = v.iso;
              } else {
                acc[key] = v;
              }
              return acc;
            }, {});

            return {
              ...raw,
              _object: item,
            }
          });
          return tableData;
        }, [queryKey, data, dupes]);

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
                refetch={refetch}
                objectType={objectClass}
                exportData={exportData}
                handleCreateNew={props.handleCreateNew ? props.handleCreateNew({ refetch }) : handleCreateNew}
              />
            </CardBody>
          </Card>
        )
      }}
    </ParseCollectionLiveQuery>
  );
}
