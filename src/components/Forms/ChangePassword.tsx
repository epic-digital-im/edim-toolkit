import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import { BsCircleFill } from "react-icons/bs";
//@ts-ignore
import { Element } from "react-scroll";
import { Formik, Form, FormikHelpers } from "formik";
import TextField from "../Fields/TextField2";
import { SubmitButton, BackButton } from './FormButtons';
import * as Yup from 'yup';
import { useContainer as useAuth } from '../../providers/auth';
import {
  _UserAttributes
} from '@app/shared/parse-types';

interface ChangePasswordFormAttributes {
  passwordCurrent: string;
  passwordNew: string;
  passwordConfirm: string;
}

interface ChangePasswordFormProps {
  title?: string;
  initialValues?: Partial<ChangePasswordFormAttributes>;
  refetch: () => void;
  onCancel?: () => void;
}

const ChangePasswordForm = ({ initialValues, refetch, onCancel, title }: ChangePasswordFormProps) => {
  const { user, signIn } = useAuth();
  const textColor = useColorModeValue("gray.700", "white");
  const bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    passwordCurrent: Yup
      .string()
      .required('Please enter your current password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Must be at least 8 characters in length and contain one Uppercase, One Lowercase and One Number"
      ),
    passwordNew: Yup
      .string()
      .required('Please enter your password')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "Must be at least 8 characters in length and contain one Uppercase, One Lowercase and One Number"
      ),
    passwordConfirm: Yup.string().oneOf([Yup.ref('passwordNew'), null], 'Passwords must match')
  });

  const intial: Partial<any> = initialValues || {
    password: '',
    passwordConfirm: '',
    passwordCurrent: '',
  };

  const handleSubmit = async (values: Partial<ChangePasswordFormAttributes>, { setSubmitting, setErrors }: FormikHelpers<Partial<ChangePasswordFormAttributes>>) => {
    setSubmitting(true);
    try {
      const { passwordCurrent, passwordConfirm, passwordNew } = values;
      setSubmitting(false);
      await Parse.User.logIn(user?.get('username'), passwordCurrent);
      user?.setPassword(passwordNew);
      await user?.save();
      toast({
        title: "Password successfully changed",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      setSubmitting(false);
      toast({
        title: "ERROR: " + err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={intial}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Card>
              <Element id="change-password" name="change-password">
                <CardHeader mb="40px">
                  <Text color={textColor} fontSize="lg" fontWeight="semibold">
                    Change Password
                  </Text>
                </CardHeader>
                <CardBody>
                  <Stack direction="column" spacing="20px" w="100%">
                    <TextField
                      label="Current Password"
                      placeholder="Current Password"
                      name="passwordCurrent"
                      type="password"
                    />
                    <TextField
                      label="New Password"
                      placeholder="New Password"
                      name="passwordNew"
                      type="password"
                    />
                    <TextField
                      label="Confirm New Password"
                      placeholder="Confirm New Password"
                      name="passwordConfirm"
                      type="password"
                    />
                    <Flex direction="row" width="100%">
                      <Flex direction="column" w="50%">
                        <Flex direction="column">
                          <Text
                            color={textColor}
                            fontWeight="bold"
                            fontSize="lg"
                            mb="4px"
                          >
                            Password Requirements
                          </Text>
                          <Text color="gray.400" fontWeight="normal" fontSize="sm">
                            Please follow this guide for a strong password.
                          </Text>
                        </Flex>
                        <Flex
                          direction={{ sm: "column", lg: "row" }}
                          justify="space-between"
                          w="100%"
                        >
                          <Stack
                            direction="column"
                            spacing="6px"
                            mb={{ sm: "12px", lg: "0px" }}
                          >
                            <Flex align="center">
                              <Icon
                                as={BsCircleFill}
                                w="6px"
                                h="6px"
                                color="gray.500"
                                me="6px"
                              />
                              <Text color="gray.500" fontWeight="normal" fontSize="xs">
                                One special characters
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Icon
                                as={BsCircleFill}
                                w="6px"
                                h="6px"
                                color="gray.500"
                                me="6px"
                              />
                              <Text color="gray.500" fontWeight="normal" fontSize="xs">
                                Min 6 characters
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Icon
                                as={BsCircleFill}
                                w="6px"
                                h="6px"
                                color="gray.500"
                                me="6px"
                              />
                              <Text color="gray.500" fontWeight="normal" fontSize="xs">
                                One number (2 are recommended)
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Icon
                                as={BsCircleFill}
                                w="6px"
                                h="6px"
                                color="gray.500"
                                me="6px"
                              />
                              <Text color="gray.500" fontWeight="normal" fontSize="xs">
                                Change it often
                              </Text>
                            </Flex>
                          </Stack>
                        </Flex>
                      </Flex>
                      <Flex direction="row" w="50%" justifyContent={'end'}>
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
                          label={"UPDATE PASSWORD"}
                          size={'sm'}
                          fontSize={'sm'}
                          alignSelf={'flex-start'}
                        />
                      </Flex>
                    </Flex>
                  </Stack>
                </CardBody>
              </Element>
            </Card>
            <Card>
              <CardBody>

              </CardBody>
            </Card>
          </Form>
        )
      }}
    </Formik >
  )
}

export default ChangePasswordForm;
