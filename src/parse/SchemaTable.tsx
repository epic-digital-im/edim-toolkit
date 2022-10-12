import Parse from 'parse/dist/parse.min.js';
import React, { useEffect, useState, useMemo } from 'react';

import {
  ClassTable,
  ClassTableProps,
} from "./ClassTable";

import {
  EditableDateCell,
  EditableCell,
  EditableAttributeCell,
  EditableNumberCell,
  EditableRelationCell,
  EditableBooleanCell,
} from './ClassTableFields';

import { SettingsIcon } from '@chakra-ui/icons';

import { useQuery } from '@tanstack/react-query';

import {
  useDisclosure,
  Flex,
  IconButton,
  Button,
} from '@chakra-ui/react';

import Selector from '../components/Selectors/Selector';
import { AttributeAttributes } from '@app/shared/parse-types';
import getters from '@app/shared/utils/getters';
import { DeleteButton } from '../components/Buttons/DeleteButton';
import { useHistory } from 'react-router-dom';
import { SchemaSettingsModal } from './SchemaConfig';
import { ClassNames } from '@app/shared/types';

const CellRenderMap = {
  "Date": EditableDateCell,
  "Boolean": EditableBooleanCell,
  "Number": EditableNumberCell,
  "String": EditableCell,
  "Object": EditableCell,
  "ACL": EditableCell,
  "Pointer": EditableRelationCell,
  "Relation": EditableRelationCell,
}

export interface SchemaTableProps extends ClassTableProps {
  objectClass: ClassNames;
  handleCreateNew: ({ refetch }: { refetch: any }) => () => Promise<any>;
  columnRenderMap?: { [key: string]: React.FC<any> };
  query?: Parse.Query;
  queryKey?: any;
}

export const SchemaTable: React.FC<SchemaTableProps> = ({ query, queryKey, handleCreateNew, objectClass, columnRenderMap }) => {
  const history = useHistory();
  const [selectedSchema, setSelectedSchema] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getClassSchemas = async () => {
    const classSchema = await Parse.Cloud.run('getClassSchemas');
    return classSchema;
  }

  const getClassSchemaConfig = async () => {
    const SchemaConfigClass = Parse.Object.extend('SchemaConfig');
    const query = new Parse.Query(SchemaConfigClass);
    query.equalTo('schema', selectedSchema.className);
    const config = await query.first();
    if (!config) {
      return new SchemaConfigClass({
        schema: selectedSchema.className,
        columnOrder: Object.keys(selectedSchema.fields),
        columnWidths: {},
        columnVisibility: {},
      });
    }
    return config;
  }

  const ClassSchemaOptionsRequest = useQuery(
    ['ClassSchemaConfig', selectedSchema && selectedSchema.className],
    () => getClassSchemaConfig(),
    {
      enabled: !!selectedSchema,
    }
  );

  const classSchemaConfig = ClassSchemaOptionsRequest.data;

  const setColumnOrder = (columnOrder: string[]) => {
    if (classSchemaConfig) {
      classSchemaConfig.set('columnOrder', columnOrder);
      classSchemaConfig.save().then(() => {
        ClassSchemaOptionsRequest.refetch();
      });
    }
  }

  const ClassSchemaRequest = useQuery(
    ['ClassSchemas'],
    () => getClassSchemas(),
  );

  useEffect(() => {
    if (ClassSchemaRequest.data) {
      const selected = (objectClass)
        ? ClassSchemaRequest.data.find((schema) => schema.className === objectClass)
        : ClassSchemaRequest.data[0];
      setSelectedSchema(selected);
    }
  }, [ClassSchemaRequest.data]);

  const handleSchemaChange = (className: string) => {
    const schema = ClassSchemaRequest.data.find(schema => schema.className === className);
    setSelectedSchema(schema);
  }

  const columns = useMemo(() => {
    if (!selectedSchema) return [];
    const cols = Object.keys(selectedSchema.fields)
      .filter((field) => {
        const visibility = classSchemaConfig?.get('columnVisibility') || {};
        return visibility[field] !== false;
      })
      .map((field) => {
        const columnEditable = classSchemaConfig?.get('columnEditable') || {};
        const editable = columnEditable[field] === true;
        const f = selectedSchema.fields[field];
        let CellRender = CellRenderMap[f.type] || EditableCell;

        if (f.type === 'Pointer' && f.targetClass.indexOf('Attribute') > -1) {
          CellRender = EditableAttributeCell({
            attributeName: field,
            objectClass: f.targetClass,
            valueGetter: (row: AttributeAttributes) => row.objectId,
            labelGetter: (row: AttributeAttributes) => row.value,
          });
        } else if (f.type === 'Pointer') {
          CellRender = EditableRelationCell({
            objectClass: f.targetClass,
            ...getters(f.targetClass),
            isClearable: true,
          });
        } else if (f.type === 'Relation' && f.targetClass.indexOf('Attribute') > -1) {
          console.log(f);
          CellRender = EditableAttributeCell({
            attributeName: field,
            objectClass: f.targetClass,
            valueGetter: (row: AttributeAttributes) => row.objectId,
            labelGetter: (row: AttributeAttributes) => row.value,
            isClearable: true,
            isMulti: true,
          });
        }

        const columnWidths = classSchemaConfig?.get('columnWidths') || {};

        if (columnRenderMap && columnRenderMap[field]) {
          CellRender = columnRenderMap[field];
        }

        return {
          Header: field,
          accessor: field,
          width: columnWidths[field] || 200,
          Cell: CellRender,
          editable,
        };
      }).reduce((acc, val) => {
        const sortOrder = classSchemaConfig?.get('columnOrder') || [];
        if (sortOrder.length > 0 && sortOrder.indexOf(val.accessor) !== -1) {
          acc[sortOrder.indexOf(val.accessor)] = val;
          return acc;
        }
        return [...acc, val];
      }, []).filter((col) => !!col);

    cols.push({
      Header: 'Actions',
      accessor: 'actions',
      width: 300,
      Cell: ({ row }) => {
        const getter = getters(objectClass);
        return (
          <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Button onClick={() => history.push(`/admin/${getter && getter.detailPath || objectClass.toLowerCase()}/${row.original._object.id}`)}>
              Detail
            </Button>
            <DeleteButton object={row.original._object} />
          </Flex>
        )
      }
    });

    return cols;
  }, [selectedSchema, classSchemaConfig]);

  const schemaOptions = useMemo(() => {
    if (!ClassSchemaRequest.data) return [];
    return ClassSchemaRequest.data.map((schema) => {
      return {
        value: schema.className,
        label: schema.className,
      }
    })
  }, [ClassSchemaRequest]);

  if (!selectedSchema) return null;

  const splitTitleCase = (str: string) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <>
      <ClassTable
        isAdmin
        objectClass={selectedSchema.className}
        title={splitTitleCase(selectedSchema.className)}
        query={query}
        queryKey={queryKey}
        showFilters
        findAll
        columnsData={columns}
        onColumnOrderChange={setColumnOrder}
        handleCreateNew={handleCreateNew}
        renderFilters={() => (
          <>
            {!objectClass && (
              <Selector
                style={{ width: '250px' }}
                label="Schema"
                options={schemaOptions}
                initialValue={selectedSchema && { label: selectedSchema.className, value: selectedSchema.className }}
                onSelect={handleSchemaChange}
              />
            )}
            <IconButton
              aria-label='Open Table Options'
              icon={<SettingsIcon />}
              onClick={onOpen} />
          </>
        )}
      />
      <SchemaSettingsModal
        isOpen={isOpen}
        onClose={onClose}
        schema={selectedSchema}
        config={classSchemaConfig}
        onColumnOrderChange={setColumnOrder}
        refetch={ClassSchemaOptionsRequest.refetch}
      />
    </>
  );
}
