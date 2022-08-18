import React, { useState } from 'react';
import { Flex, Text, Button, IconButton, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { FaTrashAlt } from "react-icons/fa";

import ConfirmDialog from '../ConfirmDialog';

interface DeleteButtonProps {
  object: Parse.Object<any>;
  onDelete?: () => void;
  label?: string;
  refetch?: () => void;
  type?: 'button' | 'icon';
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ object, onDelete, label, refetch, type }) => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await object.destroy();
      toast({
        title: 'Success',
        description: `${object.className} deleted successfully`,
        status: 'success',
        duration: 5000,
      })
      if (onDelete) onDelete();
      if (refetch) refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error deleting object: ' + err?.message,
        status: 'error',
        duration: 5000,
      })
    }
    setIsDeleting(false);
  }

  return (
    <>
      {(type === 'icon') ? (
        <IconButton
          aria-label={label || "Delete"}
          icon={<Icon as={FaTrashAlt} me="4px" />}
          onClick={onOpen}
          isDisabled={isDeleting}
          isLoading={isDeleting}
          color="red.500"
        />
      ) : (
        <Button p="0px" bg="transparent" onClick={onOpen}>
          <Flex color="red.500" cursor="pointer" align="center" p="12px">
            <Icon as={FaTrashAlt} me="4px" />
            <Text fontSize="sm" fontWeight="semibold">
              DELETE
            </Text>
          </Flex>
        </Button>
      )}
      <ConfirmDialog
        objectClass={object.className}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default DeleteButton;