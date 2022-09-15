import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

function BillingRow(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const nameColor = useColorModeValue("gray.500", "white");
  const { name, company, email, number } = props;

  return (
    <Box p="24px" bg={bgColor} mb="22px" borderRadius="12px">
      <Flex justify="space-between" w="100%">
        <Flex direction="column">
          <Text color={nameColor} fontSize="md" fontWeight="bold" mb="10px">
            {name}
          </Text>
          <HStack>
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              Company Name:{" "}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {company}
            </Text>
          </HStack>
          <HStack>
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              Email Address:{" "}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {email}
            </Text>
          </HStack>
          <HStack>
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              TID Number:{" "}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {number}
            </Text>
          </HStack>
        </Flex>
        <Flex
          direction={{ base: "column" }}
          align="flex-start"
          p={{ md: "24px" }}
        >
          <Button
            p="0px"
            bg="transparent"
            mb={{ sm: "10px", md: "0px" }}
            me={{ md: "12px" }}
          >
            <Flex color="red.500" cursor="pointer" align="center" p="12px">
              <Icon as={FaTrashAlt} me="4px" />
              <Text fontSize="sm" fontWeight="semibold">
                DELETE
              </Text>
            </Flex>
          </Button>
          <Button p="0px" bg="transparent">
            <Flex color={textColor} cursor="pointer" align="center" p="12px">
              <Icon as={FaPencilAlt} me="4px" />
              <Text fontSize="sm" fontWeight="semibold">
                EDIT
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}

export default BillingRow;
