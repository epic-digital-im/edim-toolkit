import {
  Button,
  Flex,
  Icon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from "@chakra-ui/react";

import React from "react";

import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const createPages = (count: number) => {
  const arrPageCount: number[] = [];
  for (let i = 1; i <= count; i++) {
    arrPageCount.push(i);
  }
  return arrPageCount;
};

export const Pagination = ({ previousPage, canPreviousPage, gotoPage, pageSize, pageIndex, count, nextPage, canNextPage }) => {
  const pageCount = Math.ceil(count / pageSize);
  return (
    <Flex
      direction={{ sm: "column", md: "row" }}
      justify="space-between"
      align="center"
      px="22px"
      w="100%"
      px={{ md: "22px" }}
    >
      <Text
        fontSize="sm"
        color="gray.500"
        fontWeight="normal"
        mb={{ sm: "24px", md: "0px" }}
      >
        Showing {pageSize * pageIndex + 1} to{" "}
        {pageSize * (pageIndex + 1) <= count
          ? pageSize * (pageIndex + 1)
          : count}{" "}
        of {count} entries
      </Text>
      <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
        <Button
          variant="no-hover"
          onClick={() => previousPage()}
          transition="all .5s ease"
          w="40px"
          h="40px"
          borderRadius="50%"
          bg="#fff"
          border="1px solid lightgray"
          disabled={!canPreviousPage}
          _hover={{
            bg: "gray.200",
            opacity: "0.7",
            borderColor: "gray.500",
          }}
        >
          <Icon as={GrFormPrevious} w="16px" h="16px" color="gray.400" />
        </Button>
        {pageSize === 5 ? (
          <NumberInput
            max={pageCount - 1}
            min={1}
            w="75px"
            mx="6px"
            defaultValue="1"
            onChange={(e) => gotoPage(e)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper onClick={() => nextPage()} />
              <NumberDecrementStepper onClick={() => previousPage()} />
            </NumberInputStepper>
          </NumberInput>
        ) : (
          createPages(pageCount).map((pageNumber, index) => {
            return (
              <Button
                variant="no-hover"
                transition="all .5s ease"
                onClick={() => gotoPage(pageNumber - 1)}
                w="40px"
                h="40px"
                borderRadius="160px"
                bg={pageNumber === pageIndex + 1 ? "qcmidnight.400" : "#fff"}
                border="1px solid lightgray"
                _hover={{
                  bg: "gray.200",
                  opacity: "0.7",
                  borderColor: "gray.500",
                }}
                key={`${pageNumber}_${index}`}
              >
                <Text
                  fontSize="xs"
                  color={
                    pageNumber === pageIndex + 1 ? "#fff" : "gray.600"
                  }
                >
                  {pageNumber}
                </Text>
              </Button>
            );
          })
        )}
        <Button
          variant="no-hover"
          onClick={() => nextPage()}
          transition="all .5s ease"
          w="40px"
          h="40px"
          borderRadius="160px"
          bg="#fff"
          border="1px solid lightgray"
          disabled={!canNextPage}
          _hover={{
            bg: "gray.200",
            opacity: "0.7",
            borderColor: "gray.500",
          }}
        >
          <Icon as={GrFormNext} w="16px" h="16px" color="gray.400" />
        </Button>
      </Stack>
    </Flex>
  )
}

export default Pagination;