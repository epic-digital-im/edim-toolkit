import React from 'react';
import { CustomerAttributes, PropertyAttributes, RunnerAttributes, _UserAttributes } from "@app/shared/parse-types";

import {
  Flex,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";

import { FaMapMarkerAlt } from "react-icons/fa";

const FormattedAddress = ({ addressLine1, addressLine2, city, state, zip, country }: Partial<CustomerAttributes | PropertyAttributes | RunnerAttributes>) => {
  const textColor = useColorModeValue("gray.500", "white");
  if (
    !addressLine1 ||
    !city ||
    !state ||
    !zip ||
    !country
  ) return null;
  return (
    <Flex direction={'row'}>
      <Icon as={FaMapMarkerAlt} width={'1.25rem'} height={'1.25rem'} mr={'0.25rem'} />
      <Flex direction={'column'}>
        <Text color={textColor} fontWeight="normal" fontSize="sm">
          {`${addressLine1}`} {`${addressLine2}`}
        </Text>
        <Text color={textColor} fontWeight="normal" fontSize="sm">
          {`${city}, ${state} ${zip} ${country}`}
        </Text>
      </Flex>
    </Flex>
  )
}

export default FormattedAddress;