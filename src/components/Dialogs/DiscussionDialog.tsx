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
  AlertDialogCloseButton,
  Flex,
} from "@chakra-ui/react";

import { ClassNames } from '@app/shared/types';

import Discussion from '../Discussion/Discussion';

interface ConfirmDialogProps extends AlertDialogProps {
  onConfirm: () => void;
  objectClass?: ClassNames;
  object: Parse.Object<any>;
  context?: string;
  title?: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  color: string;
  onChange: (color: string) => void;
}
const DiscussionDialog = ({
  onConfirm,
  onClose,
  objectClass,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onChange,
  color,
  object,
  context,
  ...rest
}: DiscussionDialogProps) => {
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
          <AlertDialogHeader fontSize='md' fontWeight='bold' pr={'40px'} pb={0}>
            {title || `${object.className} Discussion`}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Flex width={'100%'} justifyContent={'center'}>
              <Discussion
                object={object}
                context={context}
                onCreate={console.log}
                isDialog
              />
            </Flex>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default DiscussionDialog;