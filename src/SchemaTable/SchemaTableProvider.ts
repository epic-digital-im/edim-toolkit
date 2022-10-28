import { createContainer } from 'unstated-next';
import Parse from 'parse/dist/parse.min.js';
import { useEffect, useState } from 'react';
import { SchemaConfig } from '@app/shared/parse-types';
import { useDisclosure } from '@chakra-ui/react';
import { LiveCollectionQueryOptions } from '../../dist';
import getters from '@app/shared/utils/getters';

import { Plugin, PluginTypes } from './types';

import useSchemas from './hooks/useSchemas';
import useConfig from './hooks/useConfig';
import useColumns from './hooks/useColumns';
import usePagination from './hooks/usePagination';
import useGraphqlQuery from './hooks/useGraphqlQuery';

import RenderPlugins from './CellRendererPlugins';

interface SchemaConfigProviderState {
  objectClass: string;
  schemaConfig: SchemaConfig;
  selectedSchema: Parse.Schema;
  setSelectedSchema: (schema: Parse.Schema) => void;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  schemaOptions: { value: string; label: string }[]
  handleSchemaChange: (value: string) => void;
  refetch: () => void;
  FormDialogState: ReturnType<typeof useDisclosure>;
  OptionsDialogState: ReturnType<typeof useDisclosure>;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  tableData: any[];
  handleCreateNew: () => void;
  tableColumns: any[];
  handleExport: () => void;
  exportLoading: boolean;
  handleImport: (data: any) => void;
  importLoading: boolean;
  handleEdit: (item: any) => void;
  renderers: Plugin[];
  handleStateChange: (state: any) => void;
  pagination: ReturnType<typeof usePagination>;
  viewType: string;
  setViewType: (viewType: string) => void;
  fetchQuery: (props: { variables: any, queryOptions: any }) => void;
}

interface SchemaConfigProviderProps extends LiveCollectionQueryOptions {
  plugins: Plugin[];
  isAdmin?: boolean;
}

const SchemaConfigProvider = (props: SchemaConfigProviderProps): SchemaConfigProviderState => {
  const { objectClass, plugins, isAdmin } = props;
  const renderers = [...RenderPlugins, ...plugins?.find(p => p.type === PluginTypes.CellRenderer) || []];
  const getter = getters(objectClass);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [importLoading, setImportLoading] = useState<any>();
  const OptionsDialogState = useDisclosure();
  const FormDialogState = useDisclosure();
  const intialView = 'list';
  const [viewType, setViewType] = useState(intialView);

  const ClassSchemas = useSchemas({ objectClass });
  const { selectedSchema, setSelectedSchema, schemaOptions, handleSchemaChange } = ClassSchemas;

  const SchemaConfig = useConfig({ schema: selectedSchema });
  const { schemaConfig, setColumnOrder } = SchemaConfig;

  const TableColumns = useColumns({
    config: schemaConfig,
    schema: selectedSchema,
    plugins,
    isAdmin,
  });

  const {
    tableColumns,
    handleExport,
    exportLoading,
    include,
    select,
    columnOrder,
  } = TableColumns;

  const pagination = usePagination();

  // const queryConfig = {
  //   ...props,
  //   include,
  //   select,
  //   limit: pagination.pageSize,
  //   skip: pagination.pageIndex * pagination.pageSize,
  //   options: {
  //     enabled: !!tableColumns && !!selectedSchema && !!schemaConfig,
  //   },
  // }

  // const collectionQuery = useLiveCollectionQuery(queryConfig);


  // const { tableData } = useTableData({ data: collectionQuery.data });
  const GraphQLQuery = useGraphqlQuery({
    config: schemaConfig,
    schema: selectedSchema,
    select,
    include,
    objectClass,
    pagination,
    options: {
      enabled: !!tableColumns && !!selectedSchema && !!schemaConfig,
    },
  });

  const count = GraphQLQuery.count || 0;

  useEffect(() => {
    if (count === 0) return;
    if (count !== pagination.count) {
      pagination.setCount(count);
    }
  }, [count]);

  const handleCreateNew = async () => {
    const item = new Parse.Object(objectClass);
    item.set(getter.prop, 'New Item');
    await item.save();
    GraphQLQuery.refetch();
    return item;
  }

  const handleEdit = (row: any) => {
    setSelectedItem(row._object.toJSON());
    FormDialogState.onOpen();
  }

  const refetch = () => {
    SchemaConfig.refetch();
    ClassSchemas.refetch();
  }

  const handleImport = (data: any) => {
    console.log(data);
  }

  const data = GraphQLQuery.data || [];
  console.log(data && data[0] && data[0].objectId);

  return {
    objectClass,
    schemaConfig,
    selectedSchema,
    setSelectedSchema,
    columnOrder,
    setColumnOrder,
    schemaOptions,
    handleSchemaChange,
    refetch: GraphQLQuery.refetch,
    FormDialogState,
    selectedItem,
    setSelectedItem,
    tableData: data,
    tableColumns,
    handleCreateNew,
    handleExport,
    exportLoading,
    importLoading,
    handleImport,
    handleEdit,
    OptionsDialogState,
    renderers,
    pagination,
    isLoading: GraphQLQuery.isLoading,
    viewType,
    setViewType,
  }
}

const container = createContainer(SchemaConfigProvider);
export const { Provider, useContainer } = container;
export default container;
