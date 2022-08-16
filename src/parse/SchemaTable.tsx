import Parse from 'parse';
import React, { useEffect, useState, useMemo } from 'react';

import ClassTable, {
  EditableCell,
  EditableNumberCell,
  EditableDateCell,
  EditableBooleanCell,
  EditableRelationCell,
  EditableAttributeCell,
} from "./ClassTable";

import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';

import { IoEyeSharp, IoEyeOffSharp, IoSettings } from 'react-icons/io5'

import { useQuery } from 'react-query';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalProps,
  useDisclosure,
  Flex,
  Input,
  Icon,
  IconButton
} from '@chakra-ui/react';
import Selector from '../components/Selector';
import DraggableList from '@edim/toolkit/src/components/Draggable/DraggableList'
import { PM_AttributeAttributes } from '@app/shared/parse-types';

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

const locked = [
  'createdAt',
  'updatedAt',
  'ACL',
  'objectId',
];

interface ClassTableContainerProps {
  className?: string;
}

interface ClassSchema {
  className: string;
  fields: { [key: string]: { type: string; } };
}

interface ClassSchemaConfig {
  columnOrder: string[];
}

interface SchemaSettingsModalProps extends Partial<ModalProps> {
  schema: ClassSchema;
  config: ClassSchemaConfig;
  onColumnOrderChange: (columnOrder: string[]) => void;
}

const SchemaPropOptions = ({ prop, config, refetch }) => {
  const columnWidths = config?.get('columnWidths') || {};
  const columnVisibility = config?.get('columnVisibility') || {};
  const [width, setWidth] = useState(columnWidths[prop] || 200);
  const [visibility, setVisibility] = useState(columnVisibility[prop] !== false);

  const handleUpdate = (event) => {
    const { value } = event.target;
    const val = parseInt(value, 10);
    setWidth((!isNaN(val)) ? val : 200);
  }

  const handleBlur = () => {
    config.set('columnWidths', {
      ...columnWidths,
      [prop]: width,
    })
    config.save()
      .then(() => {
        if (refetch) refetch();
      }).catch((err) => {
        console.log(err);
      });;
  }

  const toggleVisible = () => {
    const newVisibility = !visibility;
    config.set('columnVisibility', {
      ...columnVisibility,
      [prop]: newVisibility,
    });
    setVisibility(newVisibility);
    config.save()
      .then(() => {
        if (refetch) refetch();
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <HamburgerIcon mr={3} />
      {prop}
      <Input
        type={'text'}
        value={width}
        width={'100px'}
        onChange={handleUpdate}
        onBlur={handleBlur}
        type="number"
      />
      <IconButton
        icon={visibility ? <IoEyeSharp /> : <IoEyeOffSharp />}
        onClick={toggleVisible}
      />
    </Flex>
  )
}

const SchemaSettingsModal: React.FC<SchemaSettingsModalProps> = ({ schema, config, isOpen, onClose, onColumnOrderChange, refetch }) => {
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${schema.className} Table Options`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {config && (
            <DraggableList
              items={config?.get('columnOrder') || []}
              onColumnOrderChange={onColumnOrderChange}
              renderItem={(item) => (
                <SchemaPropOptions prop={item} config={config} refetch={refetch} />
              )}
            />
          )}
        </ModalBody>
        {/* <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

const EventClassTable = ({ }: ClassTableContainerProps) => {
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

  console.log(classSchemaConfig);

  const ClassSchemaRequest = useQuery(
    ['ClassSchemas'],
    () => getClassSchemas(),
  );

  useEffect(() => {
    if (ClassSchemaRequest.data) {
      const selected = ClassSchemaRequest.data[0];
      setSelectedSchema(selected);
    }
  }, [ClassSchemaRequest.data]);

  const handleSchemaChange = (className: string) => {
    const schema = ClassSchemaRequest.data.find(schema => schema.className === className);
    setSelectedSchema(schema);
  }

  const columns = useMemo(() => {
    if (!selectedSchema) return [];
    return Object.keys(selectedSchema.fields)
      .filter((field, i) => {
        const visibility = classSchemaConfig?.get('columnVisibility') || [];
        return visibility[field] !== false;
      })
      .map((field, i) => {
        const f = selectedSchema.fields[field];
        let CellRender = CellRenderMap[f.type] || EditableCell;

        if (f.type === 'Pointer' && f.targetClass.indexOf('Attribute') > -1) {
          console.log(f.type, f.targetClass, field, f.targetClass);
          CellRender = EditableAttributeCell({
            attributeName: field,
            objectClass: f.targetClass,
            valueGetter: (row: PM_AttributeAttributes) => row.objectId,
            labelGetter: (row: PM_AttributeAttributes) => row.value,
          });
        }

        const columnWidths = classSchemaConfig?.get('columnWidths') || {};
        console.log(classSchemaConfig, columnWidths, columnWidths[field]);
        return {
          Header: field,
          accessor: field,
          width: columnWidths[field] || 200,
          editable: !locked.includes(field),
          Cell: CellRender,
        };
      }).reduce((acc, val) => {
        const sortOrder = classSchemaConfig?.get('columnOrder') || [];
        if (sortOrder.length > 0) {
          acc[sortOrder.indexOf(val.accessor)] = val;
          return acc;
        }
        return [...acc, val];
      }, [])
  }, [selectedSchema, classSchemaConfig]);

  // useEffect(() => {
  //   setColumnOrder(columns.map(c => c.accessor));
  // }, [selectedSchema]);

  const schemaOptions = useMemo(() => {
    if (!ClassSchemaRequest.data) return [];
    return ClassSchemaRequest.data.map((schema) => {
      return {
        value: schema.className,
        label: schema.className,
      }
    })
  }, [ClassSchemaRequest]);

  // console.log(schemaOptions);

  if (!selectedSchema) return null;

  return (
    <>
      <ClassTable
        isAdmin
        objectClass={selectedSchema.className}
        title={selectedSchema.className}
        showFilters
        fetchAll
        columnsData={columns}
        onColumnOrderChange={setColumnOrder}
        renderFilters={() => (
          <>
            <Selector
              style={{ width: '250px' }}
              label="Schema"
              options={schemaOptions}
              initialValue={selectedSchema && { label: selectedSchema.className, value: selectedSchema.className }}
              onSelect={handleSchemaChange}
            />
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

export default EventClassTable;
