
import {
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";

import { Formik, Form } from "formik";

import TextField from "../Fields/TextField2";
import DateSelect, { } from "../Fields/DateSelect";

import { SubmitButton } from './FormButtons';

import * as Yup from 'yup';

import {
  UserInfoValues,
} from '@app/shared/types';

interface UserInfoProps {
  initialValues: UserInfoValues;
  onSubmit: (values: UserInfoValues, { setSubmitting, setErrors }: any) => void;
}

const UserInfo = ({ initialValues, onSubmit }: UserInfoProps) => {
  const textColor = useColorModeValue("gray.700", "white");

  const validator = {
    firstName: Yup.string().required('First Name is Required'),
    lastName: Yup.string().required('Last Name is Required'),
    email: Yup.string().email('E-mail must be valid.').required('E-Mail is Required'),
    mobile: Yup.number().test('len', 'Must be exactly 10 characters', (val: any) => {
      return val && val.toString().length === 10
    }).required('Mobile Phone Required'),
  }
  if (initialValues.birthdate) {
    validator.birthdate = Yup.string().required('Birthdate is Required');
    validator.month = Yup.string().notOneOf(['SELECT'], 'Month is Required');
    validator.day = Yup.string().required().notOneOf(['0'], 'Day is Required');
    validator.year = Yup.string().notOneOf(['0'], 'Year is Required');
  }
  const validationSchema = Yup.object().shape(validator);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
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
        console.log(formProps);
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Card mb="1.5rem">
              <CardHeader mb="1.5rem">
                <Flex direction="column">
                  <Text
                    color={textColor}
                    fontSize="lg"
                    fontWeight="bold"
                    mb="3px"
                  >
                    About Me
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)" }}
                    templateRows={{ md: "repeat(2, 1fr)" }}
                    gap="24px"
                  >
                    <TextField label="First Name" placeholder="eg. John" name="firstName" type="text" />
                    <TextField label="Last Name" placeholder="eg. Smith" name="lastName" type="text" />
                    {initialValues.birthdate && <DateSelect label="Date Of Birth" name="birthdate" />}
                  </Grid>
                </Flex>
              </CardBody>
            </Card>
            <Card mb="1.5rem">
              <CardHeader mb="1.5rem">
                <Flex direction="column">
                  <Text
                    color={textColor}
                    fontSize="lg"
                    fontWeight="bold"
                    mb="3px"
                  >
                    Contact Info
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)" }}
                    templateRows={{ md: "repeat(1, 1fr)" }}
                    gap="24px"
                  >
                    <TextField disabled label="Email" placeholder="eg. john@smith.com" name="email" type="email" />
                    <TextField label="Mobile Phone" placeholder="eg. 4805551212" name="mobile" type="number" maxLength="10" />
                  </Grid>
                </Flex>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Flex direction="column" w="100%">
                  <SubmitButton
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    label="NEXT"
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

export default UserInfo;