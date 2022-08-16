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
import ToggleField from "../Fields/Toggle";

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
    setSubmitting(true);
    try {
      const EventClass = Parse.Object.extend(ClassNames.Event);
      const event = new EventClass(values);
      event.set('cventNeeded', values.cventNeeded);
      event.set('jifflenowNeeded', values.jifflenowNeeded);
      event.set('shippingRequired', values.shippingRequired);
      event.set('venueContracted', values.venueContracted);
      event.set('start', values.start ? new Date(values.start) : null);
      event.set('end', values.end ? new Date(values.end) : null);
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
                    <GridItem>
                      <ClassSearchSelectField
                        name="hotelName"
                        style={{ width: '100%' }}
                        label="Hotel Name:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_hotelName`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'hotelName',
                          }
                        ]}
                      />
                    </GridItem>
                    <GridItem>
                      <ClassSearchSelectField
                        name="hotelLocation"
                        style={{ width: '100%' }}
                        label="Hotel Location:"
                        initialValue={null}
                        objectClass={ClassNames.Attribute}
                        queryName={`${ClassNames.Attribute}_hotelLocation`}
                        valueGetter={(attribute: AttributeAttributes) => attribute?.objectId}
                        labelGetter={(attribute: AttributeAttributes) => attribute?.value}
                        filters={[
                          {
                            prop: 'name',
                            method: 'equalTo',
                            value: 'hotelLocation',
                          }
                        ]}
                      />
                    </GridItem>

                    <GridItem>
                      <TextField label="Internal Attendees" placeholder="" name="internalAttendees" type="number" />
                    </GridItem>

                    <GridItem>
                      <TextField label="External Attendees" placeholder="" name="externalAttendees" type="number" />
                    </GridItem>

                    <GridItem colSpan={2}>
                      <TextField label="Commit Peak" placeholder="" name="commitPeak" type="number" />
                    </GridItem>

                    <GridItem>
                      <ToggleField label="CVENT Reg. Site Needed?" name="cventNeeded" />
                    </GridItem>

                    <GridItem>
                      <ToggleField label="Jifflenow Required?" name="jifflenowNeeded" />
                    </GridItem>

                    <GridItem>
                      <ToggleField label="Venue Contracted?" name="venueContracted" />
                    </GridItem>

                    <GridItem>
                      <ToggleField label="Shipping Required?" name="shippingRequired" />
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