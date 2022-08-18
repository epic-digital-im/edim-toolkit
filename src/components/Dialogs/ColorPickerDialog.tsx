import React, { useRef } from 'react';
import { SketchPicker } from 'react-color'

import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogProps,
  Flex,
} from "@chakra-ui/react";

import { ClassNames } from '@app/shared/types';

interface ConfirmDialogProps extends AlertDialogProps {
  onConfirm: () => void;
  objectClass?: ClassNames;
  title?: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  color: string;
  onChange: (color: string) => void;
}
const ConfirmDialog = ({
  onConfirm,
  onClose,
  objectClass,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onChange,
  color,
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
            <Flex width={'100%'} justifyContent={'center'}>
              <SketchPicker color={color} onChangeComplete={onChange} />
            </Flex>
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
