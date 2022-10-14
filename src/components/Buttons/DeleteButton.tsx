import React, { useState } from 'react';
import { Flex, Text, Button, IconButton, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { FaTrashAlt } from "react-icons/fa";
import ConfirmDialog from '../Dialogs/ConfirmDialog';

interface DeleteButtonProps {
  object?: Parse.Object<any>;
  onDelete?: () => void;
  label?: string;
  refetch?: () => void;
  type?: 'button' | 'icon';
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ object, onDelete, label, refetch, type, ...rest }) => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (object) {
        await object.destroy();
      }
      if (onDelete) {
        await onDelete();
      }
      toast({
        title: 'Success',
        description: `${object?.className} deleted successfully`,
        status: 'success',
        duration: 5000,
      });
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
          {...rest}
        />
      ) : (
        <Button p="0px" bg="transparent" onClick={onOpen} {...rest}>
          <Flex color="red.500" cursor="pointer" align="center" p="12px">
            <Icon as={FaTrashAlt} me="4px" />
            <Text fontSize="sm" fontWeight="semibold">
              DELETE
            </Text>
          </Flex>
        </Button>
      )}
      <ConfirmDialog
        objectClass={object?.className || 'Confirm Delete'}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
      />
    </>
  )
}

export default DeleteButton;