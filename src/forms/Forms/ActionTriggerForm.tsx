import {
  Flex,
  Stack,
  Text,
  Grid,
  Box,
} from "@chakra-ui/react";

import { Formik, Form, FormikHelpers } from "formik";

import * as Yup from 'yup';
import TextField from "../Fields/TextField2";
import WeekaySelect from "../Fields/WeekaySelectField";

import { SubmitButton, BackButton } from './FormButtons';

import ClassSearchSelectField from "../Fields/ClassSearchSelectField";
import CanStatusSelect from "../Fields/CanStateSelectField";
import { CanStates, TaskStatus, ClassNames, ClassNamesList, TriggerList, ActionConditionList } from '@app/shared/types';

import ClassSchemas from '@app/shared/schema'

import {
  Property,
  PropertyAttributes,
  Task,
  TaskAttributes,
  Route,
  RouteAttributes,
  ActionTriggerAttributes,
} from '@app/shared/parse-types';

import SelectField from "../Fields/SelectField";
import ToggleField from "../Fields/ToggleField";

interface ActionTriggerFormProps {
  onSubmit?: (values: Partial<PropertyAttributes>, { setSubmitting, setErrors }: FormikHelpers<Partial<PropertyAttributes>>) => void;
  onCancel?: () => void;
  onClose?: () => void;
  isAdmin?: boolean;
  refetch?: () => void;
}

const whitelistKeys = [
  "objectId",
  "property",
]

const ActionTriggerForm: React.FC<ActionTriggerFormProps> = (props) => {

  const { initialValues, onCancel, onClose, refetch } = props;

  const validator = {
    name: Yup.string().required('Name is Required'),
    objectClass: Yup.string().required('Object Class is Required'),
    property: Yup.string().required('Property is Required'),
    condition: Yup.string().required('Condition is Required'),
    trigger: Yup.string().required('Trigger is Required'),
    active: Yup.boolean(),
  }

  const validationSchema = Yup.object().shape(validator);

  const defaults = {
    name: '',
    objectClass: '',
    property: '',
    condition: '',
    trigger: '',
    active: true,
  };

  const iv = initialValues ? Object.keys(initialValues).reduce((acc: any, key: string) => {
    if (whitelistKeys.indexOf(key) > -1) {
      acc[key] = initialValues[key]
    }
    return acc;
  }, {} as Partial<ActionTriggerAttributes>) : {};

  const onSubmit = async (values: ActionTriggerAttributes, { setSubmitting, setErrors }: FormikHelpers<ActionTriggerAttributes>) => {
    setSubmitting(true);
    const ActionTriggerClass = Parse.Object.extend(ClassNames.ActionTrigger);
    const at = new ActionTriggerClass(values);
    await at.save();
    setSubmitting(false);
    if (onCancel) onCancel();
    if (refetch) refetch();
  };

  return (
    <Formik
      initialValues={{ ...defaults, ...iv }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    // enableReinitialize
    >
      {({
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => {
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex direction="column" w="100%">
              <Stack direction="column" spacing="20px">
                <TextField name={'name'} label="Name:" />
                <SelectField
                  label="Object Class:"
                  name="objectClass"
                  options={ClassNamesList.map((val: string) => ({ label: val, value: val }))}
                />
                <TextField name={'property'} label="Property:" />
                <SelectField
                  label="Condition:"
                  name="condition"
                  options={ActionConditionList.map((val: string) => ({ label: val, value: val }))}
                />
                <SelectField
                  label="Trigger:"
                  name="trigger"
                  options={TriggerList.map((val: string) => ({ label: val, value: val }))}
                />
                <ToggleField name={'active'} label="Active:" />
                <Flex direction="row" alignContent={'flex-end'} justifyContent={'flex-end'} w="100%">
                  {onCancel && <BackButton
                    mr={'1.5rem'}
                    onClick={onCancel}
                    label="CANCEL"
                    size={'sm'}
                    fontSize={'sm'}
                  />}
                  <SubmitButton
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    label="SAVE"
                    size={'sm'}
                    fontSize={'sm'}
                  />
                </Flex>
              </Stack>
            </Flex>
          </Form>
        )
      }}
    </Formik>
  );
}

export default ActionTriggerForm;