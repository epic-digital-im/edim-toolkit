import Parse from 'parse/dist/parse.min.js';
import React from 'react';
import { Flex, Stack, useToast } from '@chakra-ui/react'
import { FormikHelpers, Formik, Form } from "formik";
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody"

import * as Yup from 'yup';

import BackButton from '../components/buttons/BackButton';
import SubmitButton from '../components/buttons/SubmitButton';

import Container, { useContainer } from './SchemaTableProvider';

import { useColorPalette } from '@app/theme';

import { TextField } from '../forms/Fields/TextField';
import { ToggleField } from '../forms/Fields/ToggleField';
import { ClassSearchSelectField } from '../forms/Fields/ClassSearchSelectField';
import { DatePickerField } from '../forms/Fields/DatePickerField';

import { ClassNames } from '@app/shared/types';

import { SchemaConfigProp, locked } from './types';

interface SchemaFormProps {
  initialValues: any;
  onCancel: () => void;
  refetch: () => void;
}

export const SchemaFormComponent: React.FC<SchemaFormProps> = ({ refetch }) => {
  const { textColor } = useColorPalette();

  const {
    schemaConfig,
    selectedSchema,
    setColumnOrder,
    schemaOptions,
    handleSchemaChange,
    FormDialogState,
    selectedItem,
    setSelectedItem,
  } = useContainer();

  const columnRequired = schemaConfig?.get(SchemaConfigProp.columnRequired) || {};
  const validator = {};
  const iv = selectedItem || {};

  console.log(selectedItem);

  Object.keys(selectedSchema.fields).map((name: string) => {
    const field = selectedSchema.fields[name];
    if (field.type === 'Pointer') {
      if (columnRequired[name]) {
        validator[name] = Yup.object().required(`${name} is Required`);
      }
    }
    if (field.type === 'Boolean') {
      if (columnRequired[name]) {
        validator[name] = Yup.boolean().required(`${name} is Required`);
      }
    }
    if (field.type === 'String') {
      if (columnRequired[name]) {
        validator[name] = Yup.string().required(`${name} is Required`);
      }
    }
    if (field.type === 'Date') {
      if (columnRequired[name]) {
        validator[name] = Yup.date().required(`${name} is Required`);
      }
    }
  });

  const hs = async (values: any, { setSubmitting, setErrors }: FormikHelpers<any>) => {
    setSubmitting(true);
    try {
      const className = selectedSchema.className;
      const ObjectClass = Parse.Object.extend(className);
      const object = new ObjectClass(values);
      await object.save();
      useToast({
        title: `${className} Created Successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      FormDialogState.onClose();
      if (refetch) refetch();
    } catch (err) {
      console.log(err);
      useToast({
        title: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape(validator);

  console.log(iv);

  return (
    <Formik
      initialValues={iv}
      validationSchema={validationSchema}
      onSubmit={hs}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => {
        console.log({ values, errors, touched, isSubmitting });
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Card mb="1.5rem">
              <CardBody>
                <Flex direction="column" w="100%">
                  <Stack direction="column" spacing="20px">
                    {Object.keys(selectedSchema.fields).map((name: string) => {
                      const field = selectedSchema.fields[name];
                      if (locked.includes(name)) {
                        return null;
                      }
                      if (field.type === 'String') {
                        return (
                          <TextField key={name} name={name} label={name} />
                        )
                      } else if (field.type === 'Boolean') {
                        return (
                          <ToggleField key={name} name={name} label={name} />
                        )
                      } else if (field.type === 'Date') {
                        return (
                          <DatePickerField key={name} name={name} label={name} />
                        )
                      } else if (field.type === 'Pointer') {
                        if (field.targetClass === ClassNames.Attribute) {
                          return (
                            <ClassSearchSelectField
                              key={name}
                              name={name}
                              style={{ width: '100%' }}
                              label={name}
                              placeholder={`Select ${name}`}
                              initialValue={iv[name]}
                              objectClass={ClassNames.Attribute}
                              queryName={[ClassNames.Attribute, { name }]}
                              isCreateable
                              ascending={'sort'}
                              filters={[
                                {
                                  prop: 'name',
                                  method: 'equalTo',
                                  value: name,
                                }
                              ]}
                            />
                          )
                        }
                        return (
                          <ClassSearchSelectField
                            key={name}
                            name={name}
                            label={name}
                            initialValue={iv[name]}
                            placeholder={`Select ${name}`}
                            objectClass={field.targetClass}
                            style={{ width: '100%' }}
                          />
                        )
                      } else {
                        return null;
                      }
                    })}
                  </Stack>
                </Flex>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Flex direction="row" justify="space-between" w="100%">
                  <BackButton
                    onClick={FormDialogState.onClose}
                    label="CANCEL"
                  />
                  <SubmitButton
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    label="SUBMIT"
                  />
                </Flex>
              </CardBody>
            </Card>
          </Form>
        )
      }}
    </Formik>
  );
}

const SchemaForm: React.FC<{ objectClass: string, initialValues: any }> = ({ objectClass, initialValues }) => {
  return (
    <Container.Provider initialState={{ objectClass }}>
      <SchemaFormComponent initialValues={initialValues} />
    </Container.Provider>
  )
};


export default SchemaForm;
