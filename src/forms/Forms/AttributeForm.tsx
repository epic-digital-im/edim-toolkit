import {
  Flex,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";

import { Formik, Form, FormikHelpers } from "formik";

import TextField from "../Fields/TextField2";
import TextAreaField from "../Fields/TextAreaField";

import { SubmitButton, BackButton } from './FormButtons';

import * as Yup from 'yup';

import { ClassNames } from '@app/shared/types';

import {
  Attribute,
  AttributeAttributes,
} from '@app/shared/parse-types';

interface AttributeFormProps {
  title?: string;
  initialValues?: Partial<AttributeAttributes>;
  refetch?: () => void;
  onCancel?: () => void;
  onSave?: (attribute: Attribute) => void;
  isAdmin?: boolean;
}

const AttributeForm = ({ initialValues, refetch, onCancel, title, isAdmin, onSave }: AttributeFormProps) => {
  const toast = useToast();
  const isEdit = initialValues?.objectId;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Attribute Name is Required'),
  });

  const intial: Partial<AttributeAttributes> = initialValues || {
    name: '',
    type: 'string',
    value: '',
    description: '',
    slug: '',
  };

  const handleSubmit = async (values: Partial<AttributeAttributes>, { setSubmitting, setErrors }: FormikHelpers<Partial<AttributeAttributes>>) => {
    setSubmitting(true);
    try {
      const AttributeClass = Parse.Object.extend(ClassNames.Attribute);
      const attribute = new AttributeClass(values);
      const newAttribute = await attribute.save();
      setSubmitting(false);
      toast({
        title: isEdit ? "Updated Successfully" : "Attribute Created Successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (refetch) refetch();
      if (onCancel) onCancel();
      if (onSave) onSave(attribute);
      return newAttribute;
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
            <Card mb="1.5rem">
              <CardBody>
                <Flex direction="column" w="100%">
                  <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(2, 2fr)" }}
                    templateRows={{ md: "repeat(1, 1fr)" }}
                    gap="24px"
                    mb={'1.5rem'}
                  >
                    <GridItem colSpan={2}>
                      <TextField disabled label="Attribute Name" placeholder="" name="name" type="text" />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <TextField label="Value" placeholder="" name="value" type="text" />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <TextField label="Description:" placeholder="" name="description" type="text" />
                    </GridItem>
                  </Grid>
                  {isAdmin && <Grid
                    templateColumns={{ sm: "1fr", md: "repeat(2, 2fr)" }}
                    templateRows={{ md: "repeat(1, 1fr)" }}
                    gap="24px"
                    mt={'1.5rem'}
                  >
                    <GridItem colSpan={2}>
                      <TextAreaField name="description" label="Notes" placeholder="Notes" type="text" />
                    </GridItem>
                  </Grid>}
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
                    label={isEdit ? "UPDATE" : "SAVE"}
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

export default AttributeForm;