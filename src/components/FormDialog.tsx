import React from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogProps,
} from "@chakra-ui/react";

interface FormDialogProps extends AlertDialogProps {
  onConfirm: () => void;
  objectClass?: string;
  title?: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  renderForm: () => JSX.Element;
  initialValues?: any;
}
const FormDialog = ({
  onConfirm,
  onClose,
  objectClass,
  title,
  body,
  cancelLabel,
  confirmLabel,
  renderForm,
  initialValues,
  ...rest
}: FormDialogProps) => {
  const isEdit = Boolean(initialValues?.objectId);
  return (
    <AlertDialog
      onClose={onClose}
      {...rest}
    >
      <AlertDialogOverlay zIndex={3000}>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {isEdit ? `Edit ${objectClass}` : `Add ${objectClass}`}
          </AlertDialogHeader>
          <AlertDialogBody pb={'1.5rem'}>
            {renderForm && renderForm({ initialValues })}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default FormDialog;
