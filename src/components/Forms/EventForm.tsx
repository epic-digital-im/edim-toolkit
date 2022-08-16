import {
  Flex,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";

import Card from "../Card/Card";
import CardBody from "../Card/CardBody";
import CardHeader from "../Card/CardHeader";

import { Formik, Form, FormikHelpers } from "formik";

import TextField from "../Fields/TextField2";
import TextAreaField from "../Fields/TextAreaField";
import ClassSearchSelectField from "../Fields/ClassSearchSelectField";

import { SubmitButton, BackButton } from './FormButtons';

import * as Yup from 'yup';

import { ClassNames } from '@app/shared/types';

import {
  PM_Attribute,
  PM_AttributeAttributes,
  PM_Project,
  PM_ProjectAttributes,
} from '@app/shared/parse-types';

import DatePickerField from "../Fields/DatePickerField";

interface PM_ProjectFormProps {
  title?: string;
  initialValues?: Partial<PM_ProjectAttributes>;
  refetch?: () => void;
  onCancel?: () => void;
  onSave?: (event: PM_Project) => void;
  isAdmin?: boolean;
}

const ProjectForm = ({ initialValues, refetch, onCancel, title, isAdmin, onSave }: PM_ProjectFormProps) => {
  const toast = useToast();
  const isEdit = initialValues?.objectId;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Project Name is Required'),
  });

  let intial: Partial<PM_ProjectAttributes> = {
    title: '',
    start: new Date(),
    end: null,
  };

  if (initialValues) {
    const { title, start, end, ...rest } = initialValues;
    intial.title = title || '';
    intial.start = start || null;
    intial.end = end || null;
  }

  const handleSubmit = async (values: Partial<PM_ProjectAttributes>, { setSubmitting, setErrors }: FormikHelpers<Partial<PM_ProjectAttributes>>) => {
    setSubmitting(true);
    console.log(values);
    try {
      const ProjectClass = Parse.Object.extend(ClassNames.PM_Project);
      const event = new ProjectClass(values);
      // event.set('start', values.start ? new Date(values.start) : null);
      // event.set('end', values.end ? new Date(values.end) : null);
      const newProject = await event.save();
      setSubmitting(false);
      toast({
        title: isEdit ? "Updated Successfully" : "Project Created Successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (refetch) refetch();
      if (onCancel) onCancel();
      if (onSave) onSave(event);
      return newProject;
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
        console.log(values);
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
                      <TextField label="Project Title" placeholder="" name="title" type="text" />
                    </GridItem>
                    <GridItem>
                      <DatePickerField label="Start Date:" name="start" />
                    </GridItem>
                    <GridItem>
                      <TextField label="End Date:" placeholder="" name="end" type="date" />
                    </GridItem>
                    <GridItem>
                      <ClassSearchSelectField
                        name="location"
                        style={{ width: '100%' }}
                        label="Location:"
                        initialValue={null}
                        objectClass={ClassNames.PM_Attribute}
                        queryName={[ClassNames.PM_Attribute, 'location']}
                        valueGetter={(attribute: PM_AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: PM_AttributeAttributes) => attribute?.value}
                        isCreateable
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'location',
                          }
                        ]}
                      />
                    </GridItem>
                    <GridItem>
                      <ClassSearchSelectField
                        name="type"
                        style={{ width: '100%' }}
                        label="Type:"
                        initialValue={null}
                        objectClass={ClassNames.PM_Attribute}
                        queryName={[ClassNames.PM_Attribute, 'type']}
                        valueGetter={(attribute: PM_AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: PM_AttributeAttributes) => attribute?.value}
                        isCreateable
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'type',
                          }
                        ]}
                      />
                    </GridItem>
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
    </Formik>
  )
}

export default ProjectForm;