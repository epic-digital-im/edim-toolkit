import React, { ReactElement, useState } from 'react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5'
import CellRenderMap from './CellRenderMap';
import { SchemaConfigProp, Plugin, locked } from './types';

import {
  Box,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalProps,
  Flex,
  Input,
  IconButton,
  Switch,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

import Selector from '../components/Selectors/Selector';
import DraggableList from '../components/Draggable/DraggableList'
import { useContainer } from './SchemaTableProvider';

interface SchemaSettingsModalProps extends Partial<ModalProps> {
  field?: { name: string, type: string, };
  renderers: Plugin[];
}

export const SchemaPropOptions = ({ field }: Partial<SchemaSettingsModalProps>): ReactElement => {
  const prop = field.name;
  const type = field.type;
  const { schemaConfig, refetch, renderers } = useContainer();
  const renderer = CellRenderMap[type] || CellRenderMap['default'];
  const toast = useToast();
  const columnWidths = schemaConfig?.get(SchemaConfigProp.columnWidths) || {};
  const columnVisibility = schemaConfig?.get(SchemaConfigProp.columnVisibility) || {};
  const columnRequired = schemaConfig?.get(SchemaConfigProp.columnRequired) || {};
  const columnEditable = schemaConfig?.get(SchemaConfigProp.columnEditable) || {};

  const [width, setWidth] = useState(columnWidths[prop] || 200);
  const [required, setRequired] = useState(columnRequired[prop]);
  const [visibility, setVisibility] = useState(columnVisibility[prop] !== false);
  const [editable, setEditable] = useState(columnEditable[prop] === true);

  const handleUpdate = (event) => {
    const { value } = event.target;
    const val = parseInt(value, 10);
    setWidth((!isNaN(val)) ? val : 200);
  }

  const handleUpdateProp = async (name: SchemaConfigProp, value: any) => {
    const values = schemaConfig?.get(name) || {};
    try {
      schemaConfig.set(name, {
        ...values,
        [prop]: value,
      })
      await schemaConfig.save()
      toast({
        title: `Column ${prop} updated`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (refetch) refetch();
    } catch (err) {
      console.error(err);
      toast({
        title: `Error updating ${prop}`,
        status: err.message,
        duration: 3000,
        isClosable: true,
      });
    }
  }


  const handleBlur = async () => {
    await handleUpdateProp(SchemaConfigProp.columnWidths, width);
  }

  const toggleVisible = async () => {
    const newVisibility = !visibility;
    await handleUpdateProp(SchemaConfigProp.columnVisibility, newVisibility);
    setVisibility(newVisibility);
  }

  const toggleRequired = async () => {
    const newRequired = !required;
    await handleUpdateProp(SchemaConfigProp.columnRequired, newRequired);
    setRequired(newRequired);
  }

  const toggleEditable = async () => {
    const newEditable = !editable;
    await handleUpdateProp(SchemaConfigProp.columnEditable, newEditable);
    setEditable(newEditable);
  }

  const handleRendererSelected = async (value: string) => {
    await handleUpdateProp(SchemaConfigProp.columnRenderer, value);
  }

  return (
    <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
      <Box mx={2} width={'250px'}>{prop}</Box>
      <Box mx={2}>
        <Input
          value={width}
          width={'100px'}
          onChange={handleUpdate}
          onBlur={handleBlur}
          type="number"
          mx={2}
        />
      </Box>
      <Box mx={2}>
        <Flex>
          <FormLabel htmlFor={`${prop}-editable`} mb={0} mr={2}>Editable</FormLabel>
          <Switch disabled={locked.indexOf(prop) > -1} isChecked={editable} onChange={toggleEditable} id={`${prop}-editable`} />
        </Flex>
      </Box>
      <Box mx={2}>
        <Flex>
          <FormLabel htmlFor={`${prop}-required`} mb={0} mr={2}>Required</FormLabel>
          <Switch disabled={locked.indexOf(prop) > -1} isChecked={required} onChange={toggleRequired} id={`${prop}-required`} />
        </Flex>
      </Box>
      <Box mx={2} width={'400px'}>
        <Selector
          style={{ width: '100%' }}
          initialValue={{ label: renderer, value: renderer }}
          options={renderers.map((renderer: Plugin) => ({ value: renderer.name, label: renderer.name }))}
          onSelect={handleRendererSelected}
        />
      </Box>
      <Box mx={2}>
        <HamburgerIcon mx={2} />
        <IconButton
          aria-label='Toggle visibility'
          icon={visibility ? <IoEyeSharp /> : <IoEyeOffSharp />}
          onClick={toggleVisible}
          mx={2}
        />
      </Box>
    </Flex>
  )
}

export const SchemaSettingsModal: React.FC<SchemaSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    schemaConfig,
    selectedSchema,
    setColumnOrder,
    renderers,
    columnOrder,
  } = useContainer();

  const fields: string[] = Object.keys(selectedSchema.fields);

  const items = fields.reduce((acc, val) => {
    if (!acc.find(item => item.name === val)) {
      acc[columnOrder.indexOf(val)] = {
        name: val,
        type: selectedSchema.fields[val].type,
      };
    }
    return acc;
  }, columnOrder as { [key: string]: string; }[]);

  const handleColumnOrderChange = async (newOrder: { type: string, name: string }[]) => {
    setColumnOrder(newOrder.map(item => item.name));
  }

  return (
    <Modal size={'xxl'} blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${selectedSchema.className} Table Options`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {schemaConfig && (
            <DraggableList
              items={items}
              onColumnOrderChange={handleColumnOrderChange}
              renderItem={(item) => (
                <SchemaPropOptions
                  renderers={renderers}
                  field={item}
                />
              )}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
