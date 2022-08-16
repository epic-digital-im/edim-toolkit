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
  AttributeAttributes,
  Event,
  EventAttributes,
  Property,
  PropertyAttributes
} from '@app/shared/parse-types';

interface EventFormProps {
  title?: string;
  initialValues?: Partial<EventAttributes>;
  refetch?: () => void;
  onCancel?: () => void;
  onSave?: (event: Event) => void;
  isAdmin?: boolean;
}

const EventForm = ({ initialValues, refetch, onCancel, title, isAdmin, onSave }: EventFormProps) => {
  const toast = useToast();
  const isEdit = initialValues?.objectId;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Event Name is Required'),
  });

  let intial: Partial<EventAttributes> = {
    ...initialValues,
  };

  if (initialValues) {
    const { name, start, end, ...rest } = initialValues;
    intial.name = name || '';
    intial.start = start && start?.iso.split('T')[0] || null;
    intial.end = end && end?.iso.split('T')[0] || null;
  }

  const handleSubmit = async (values: Partial<EventAttributes>, { setSubmitting, setErrors }: FormikHelpers<Partial<EventAttributes>>) => {
    const { details, ...rest } = values;
    setSubmitting(true);
    try {
      const EventClass = Parse.Object.extend(ClassNames.Event);
      const event = new EventClass(rest);
      event.set('start', values.start ? new Date(values.start) : null);
      event.set('end', values.end ? new Date(values.end) : null);
      console.log(details);
      if (details && Array.isArray(details)) {
        event.relation('details').add(details);
      }
      const newEvent = await event.save();
      setSubmitting(false);
      toast({
        title: isEdit ? "Updated Successfully" : "Event Created Successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      if (refetch) refetch();
      if (onCancel) onCancel();
      if (onSave) onSave(event);
      return newEvent;
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
                      <ClassSearchSelectField
                        name="venue"
                        style={{ width: '100%' }}
                        label="Venue:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_venue`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'venue',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <ClassSearchSelectField
                        name="details"
                        style={{ width: '100%' }}
                        label="Participation Details:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_detail`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        isMulti
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'detail',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem>
                      <ClassSearchSelectField
                        name="manager"
                        style={{ width: '100%' }}
                        label="Manager:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_person`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'person',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem>
                      <ClassSearchSelectField
                        name="stakeholder"
                        style={{ width: '100%' }}
                        label="Stakeholder:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_person`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'person',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <ClassSearchSelectField
                        name="budgetOwner"
                        style={{ width: '100%' }}
                        label="Budget Owner:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_person`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'person',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem>
                      <ClassSearchSelectField
                        name="category"
                        style={{ width: '100%' }}
                        label="Category:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_category`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'category',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem>
                      <ClassSearchSelectField
                        name="levelNumber"
                        style={{ width: '100%' }}
                        label="Level Number:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_level`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'level',
                          }
                        ]}
                      />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <ClassSearchSelectField
                        name="team"
                        style={{ width: '100%' }}
                        label="Team:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_team`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'team',
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
                    label="BACK"
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

export default EventForm;