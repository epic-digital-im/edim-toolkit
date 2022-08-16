import { useRef } from 'react';

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogProps,
} from "@chakra-ui/react";

import { ClassNames } from '@app/shared/types';

interface ConfirmDialogProps extends AlertDialogProps {
  onConfirm: () => void;
  objectClass?: ClassNames;
  title?: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}
const ConfirmDialog = ({
  onConfirm,
  onClose,
  objectClass,
  title,
  body,
  cancelLabel,
  confirmLabel,
  ...rest
}: ConfirmDialogProps) => {
  const cancelRef = useRef();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  }

  return (
    <AlertDialog
      onClose={onClose}
      {...rest}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title ? title : `Delete ${objectClass}`}
          </AlertDialogHeader>

          <AlertDialogBody>
            {body ? body : `Are you sure you want to delete this ${objectClass}?`}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {cancelLabel ? cancelLabel : 'Cancel'}
            </Button>
            <Button colorScheme='red' onClick={handleConfirm} ml={3}>
              {confirmLabel ? confirmLabel : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ConfirmDialog;
