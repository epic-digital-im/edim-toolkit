import {
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import { Formik, Form } from "formik";
import GooglePlacesAddress from "../Fields/GooglePlacesAddressField";
import { UserAddressValues } from '@app/shared/types';

import * as Yup from 'yup';

import { SubmitButton, BackButton } from './FormButtons';

interface AddressFormProps {
  initialValues: UserAddressValues;
  onSubmit: (values: UserAddressValues, { setSubmitting, setErrors }: any) => void;
  onCancel: () => void;
}

const Address = ({ onSubmit, onCancel, initialValues }: AddressFormProps) => {
  const textColor = useColorModeValue("gray.700", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");

  const validationSchema = Yup.object().shape({
    addressLine1: Yup.string().required('Address Line 1 is Required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('City is Required'),
    state: Yup.string().required('State is Required'),
    zip: Yup.string().required('Zip is Required'),
    country: Yup.string().required('Country is Required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
        /* and other goodies */
      }) => {
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Card mb="1.5rem">
              <CardHeader mb="1.5rem">
                <Text
                  color={textColor}
                  fontSize="lg"
                  fontWeight="bold"
                  mb="3px"
                >
                  Billing Address
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Stack direction="column" spacing="20px">
                    <GooglePlacesAddress />
                  </Stack>
                </Flex>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Flex direction="row" justify="space-between" w="100%">
                  <BackButton
                    onClick={onCancel}
                    label="BACK"
                  />
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
    </Formik>
  );
}

export default Address;