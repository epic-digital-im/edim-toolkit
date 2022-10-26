import React from 'react';

import ControlledTable, { ControlledTableProps } from "../components/Tables/ControlledTable";

import { Flex, Button } from '@chakra-ui/react';

import { useHistory } from 'react-router-dom';
import getters from '@app/shared/utils/getters';

import { DeleteButton } from '../components/Buttons/DeleteButton';
import { LoadingOverlay } from '../components/Loaders/LoadingOverlay';

import { Plugin } from './types';
import { SchemaSettingsModal } from './SchemaConfig';
import Container, { useContainer } from './SchemaTableProvider';
import { SchemaFormComponent } from './SchemaForm';
import FormDialog from '../components/Dialogs/FormDialog';
import { ClassNames } from '@app/shared/types';
import Pagination from './Pagination';
import Toolbar from './Toolbar';

export interface SchemaTableProps extends ControlledTableProps {
  objectClass: ClassNames;
  plugins?: Plugin[];
  isEditable?: boolean;
  isAdmin?: boolean;
  renderRowCard?: (row: any) => JSX.Element;
  renderForm?: (initialValues: any, onClose: (() => void) | undefined, refetch: (() => void) | undefined) => JSX.Element;
}

export const SchemaTableComponent: React.FC<SchemaTableProps> = ({ objectClass, isEditor, isAdmin, renderRowCard, renderForm }) => {
  const {
    selectedSchema,
    setColumnOrder,
    schemaOptions,
    handleSchemaChange,
    FormDialogState,
    selectedItem,
    setSelectedItem,
    handleCreateNew,
    tableData,
    tableColumns,
    handleEdit,
    handleExport,
    exportLoading,
    OptionsDialogState,
    refetch,
    pagination,
    isLoading,
  } = useContainer();

  const history = useHistory();

  if (!selectedSchema) return <LoadingOverlay isLoading />;

  const columns = [
    ...tableColumns,
    {
      id: 'Actions',
      header: 'actions',
      width: 200,
      cell: ({ row }) => {
        const getter = getters(objectClass);
        return (
          <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
            <Button size={'sm'} onClick={() => handleEdit(row.original)}>
              Edit
            </Button>
            <Button size={'sm'} onClick={() => history.push(`/admin/${getter && getter.detailPath || objectClass.toLowerCase()}/${row.original._object.id}`)}>
              Detail
            </Button>
            <DeleteButton type={'icon'} size={'sm'} object={row.original._object} />
          </Flex>
        )
      }
    }
  ];

  const handleStateChange = (state: any) => {
    pagination.setPageSize(state.pageSize);
  }

  // columnsData,
  // columnStyle,
  // tableData,
  // isLoading,
  // fullHeight,
  // renderHeader,
  // fixedHeader,
  // fixedFirstColumn,
  return (
    <>
      <Toolbar
        pageSizes={[100, 250, 500, 1000]}
      />
      <ControlledTable
        isLoading={isLoading}
        data={tableData}
        columns={columns}
        fixedFirstColumn
        fixedHeader
        selectable
        onSelectionChange={console.log}
      />
      <Pagination {...pagination} />
      <SchemaSettingsModal
        isOpen={OptionsDialogState.isOpen}
        onClose={OptionsDialogState.onClose}
      />
      <FormDialog
        isOpen={FormDialogState.isOpen}
        onClose={() => {
          FormDialogState.onClose();
          setSelectedItem(undefined);
        }}
        objectClass={objectClass}
        renderForm={(renderForm)
          ? () => renderForm({
            initialValue: selectedItem,
            onClose: FormDialogState.onClose,
            refetch,
          })
          : () => (
            <SchemaFormComponent refetch={() => console.log('to do: refetch')} />
          )}
      />
    </>
  );
}

export const SchemaTable: React.FC<SchemaTableProps> = (props) => (
  <Container.Provider initialState={props}>
    <SchemaTableComponent {...props} />
  </Container.Provider>
)

export default SchemaTable;