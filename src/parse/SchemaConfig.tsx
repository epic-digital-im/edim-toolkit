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

import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';

import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5'

import { useQuery } from '@tanstack/react-query';

import {
  Box,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalProps,
  useDisclosure,
  Flex,
  Input,
  IconButton,
  Button,
  Switch,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

import Selector from '../components/Selectors/Selector';
import DraggableList from '@epicdm/toolkit/src/components/Draggable/DraggableList'
import { SchemaConfig, AttributeAttributes } from '@app/shared/parse-types';
import getters from '@app/shared/utils/getters';
import { DeleteButton } from '../components/Buttons/DeleteButton';
import { useHistory } from 'react-router-dom';

const locked = [
  'createdAt',
  'updatedAt',
  'ACL',
  'objectId',
  'e_id',
];

interface ClassSchema {
  className: string;
  fields: { [key: string]: { type: string; } };
}

interface SchemaSettingsModalProps extends Partial<ModalProps> {
  schema: ClassSchema;
  config: SchemaConfig;
  onColumnOrderChange: (columnOrder: string[]) => void;
  refetch?: () => void;
}

export const SchemaPropOptions = ({ prop, config, refetch }) => {
  const toast = useToast();
  const columnWidths = config?.get('columnWidths') || {};
  const columnVisibility = config?.get('columnVisibility') || {};
  const columnEditable = config?.get('columnEditable') || {};
  const [width, setWidth] = useState(columnWidths[prop] || 200);
  const [visibility, setVisibility] = useState(columnVisibility[prop] !== false);
  const [editable, setEditable] = useState(columnEditable[prop] === true);

  const handleUpdate = (event) => {
    const { value } = event.target;
    const val = parseInt(value, 10);
    setWidth((!isNaN(val)) ? val : 200);
  }

  const handleBlur = async () => {
    try {
      config.set('columnWidths', {
        ...columnWidths,
        [prop]: width,
      })
      await config.save()
      toast({
        title: "Column width updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (refetch) refetch();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error updating column width",
        status: err.message,
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const toggleVisible = async () => {
    try {
      const newVisibility = !visibility;
      config.set('columnVisibility', {
        ...columnVisibility,
        [prop]: newVisibility,
      });
      setVisibility(newVisibility);
      await config.save();
      toast({
        title: "Column visibility updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (refetch) refetch();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error updating column visibility",
        status: err.message,
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const toggleEditable = async () => {
    try {
      const newEditable = !editable;
      config.set('columnEditable', {
        ...columnEditable,
        [prop]: newEditable,
      });
      setEditable(newEditable);
      config.save()
      toast({
        title: "Column editible updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (refetch) refetch();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error updating column editible",
        status: err.message,
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
      <HamburgerIcon mx={2} />
      <Box mx={2}>{prop}</Box>
      <Input
        value={width}
        width={'100px'}
        onChange={handleUpdate}
        onBlur={handleBlur}
        type="number"
        mx={2}
      />
      <IconButton
        aria-label='Toggle visibility'
        icon={visibility ? <IoEyeSharp /> : <IoEyeOffSharp />}
        onClick={toggleVisible}
        mx={2}
      />

      <Box ml={2}>
        <Flex>
          <FormLabel htmlFor={`${prop}-editable`} mb={0} mr={2}>Editable</FormLabel>
          <Switch disabled={locked.indexOf(prop) > -1} isChecked={editable} onChange={toggleEditable} id={`${prop}-editable`} />
        </Flex>
      </Box>
    </Flex>
  )
}

export const SchemaSettingsModal: React.FC<SchemaSettingsModalProps> = ({ schema, config, isOpen, onClose, onColumnOrderChange, refetch }) => {
  const fields: string[] = Object.keys(schema.fields);
  const columnOrder = config?.get('columnOrder') || [];
  const items = fields.reduce((acc, val) => {
    if (acc.indexOf(val) === -1) {
      acc[columnOrder.indexOf(val)] = val;
    }
    return acc;
  }, columnOrder as string[]);
  return (
    <Modal size={'xl'} blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${schema.className} Table Options`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {config && (
            <DraggableList
              items={items}
              onColumnOrderChange={onColumnOrderChange}
              renderItem={(item) => (
                <SchemaPropOptions prop={item} config={config} refetch={refetch} />
              )}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
