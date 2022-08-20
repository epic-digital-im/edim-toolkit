import Parse from 'parse/dist/parse.min.js';
import React, { useRef, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClassNames } from "@app/shared/types";

import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader";

import { FilterTable } from './FilterTable';

import { ParseCollectionLiveQuery } from '../hoc/ParseLiveQuery';
import { LoadingOverlay } from '../components/Loaders/LoadingOverlay';

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
  findAll?: boolean | undefined;
  inactive?: boolean | undefined;
  hidePaging?: boolean | undefined;
  hideSearch?: boolean | undefined;
  onColumnOrderChange?: (newOrder: string[]) => void;
  isLive?: boolean | undefined;
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
    ...tableProps
  } = props;

  const { dupes, ...tableState } = initialState || {};

  return (
    <ParseCollectionLiveQuery
      objectClass={objectClass}
      query={query}
      queryKey={queryKey}
      findAll={findAll}
      isLive={isLive}
    >
      {({ data, isLoading, refetch, isError }) => {

        const tableData = useMemo(() => {
          if (isLoading) return [];
          const d = data || [];
          const tableData = d.map((item) => {
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
              />
            </CardBody>
          </Card>
        )
      }}
    </ParseCollectionLiveQuery>
  );
}
