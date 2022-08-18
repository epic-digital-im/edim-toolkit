
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";

import { Formik, Form } from "formik";

import { TextField } from "../Fields/TextField";
import UserTypeSelect from '../Fields/UserTypeSelectField';

import { BackButton, SubmitButton } from './FormButtons';

import * as Yup from 'yup';

import {
  _UserAttributes,
} from '@app/shared/parse-types';

interface UserFormProps {
  initialValues: _UserAttributes;
  onSubmit: (values: _UserAttributes, { setSubmitting, setErrors }: any) => void;
  onCancel: () => void;
}

const UserForm = ({ initialValues, onSubmit, onCancel }: UserFormProps) => {
  const textColor = useColorModeValue("gray.700", "white");

  const validator = {
    email: Yup.string().email('Invalid email address').required('Email is Required'),
    password: Yup
      .string()
      .required('Please enter your password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Must be at least 8 characters in length and contain one Uppercase, One Lowercase and One Number"
      ),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
  }
  const validationSchema = Yup.object().shape(validator);

  return (
    <Formik
      initialValues={initialValues || { firstName: "", lastName: "", email: "", userType: "", password: "", passwordConfirm: "" }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formProps) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        } = formProps;
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Card mb="1.5rem">
              <CardBody>
                <Flex direction="column" w="100%">
                  <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)" }}
                    templateRows={{ md: "repeat(2, 1fr)" }}
                    gap="24px"
                  >
                    <TextField
                      type="email"
                      name="email"
                      label="Email"
                    />
                    <TextField
                      type="password"
                      name="password"
                      label="Password"
                    />
                    <TextField
                      type="password"
                      name="passwordConfirm"
                      label="Confirm Password"
                    />
                    <UserTypeSelect
                      name="userType"
                      label="User Type"
                    />
                  </Grid>
                </Flex>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Flex direction="row" w="100%" justifyContent={'end'}>
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
                    label="SUBMIT"
                    size={'sm'}
                    fontSize={'sm'}
                  />
                </Flex>
              </CardBody>
            </Card>
          </Form>
        )
      }}
    </Formik >
  )
}

export default UserForm;