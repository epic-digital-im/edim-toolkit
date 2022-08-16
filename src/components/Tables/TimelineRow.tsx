/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useEffect, useState } from 'react';

import {
  Box,
  Flex,
  Icon,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { elipses } from '../../utils/format';
import { NavLink } from 'react-router-dom';

import { FaCalendar, } from "react-icons/fa";

import { Attribute, Event } from "@app/shared/parse-types";

import { formatDateString } from '../../utils/format';

function TimelineRow({ event }: { event: Event }) {
  const index = 0;
  const arrLength = 1;
  const data = event.toJSON();
  const category = event.get('category');
  const color = category?.get('color');
  const startDate = event.get('start');
  const endDate = event.get('end');

  const startDateString = (startDate) ? formatDateString(startDate) : '';
  const endDateString = (endDate) ? formatDateString(endDate) : '';

  const start = startDateString.split("T")[0];
  const end = endDateString.split("T")[0];


  const title = event.get('name');
  const borderColor = "transparent";
  const backgroundColor = color;

  const className = "success";
  const logo = FaCalendar;
  const titleColor = "#fff";
  const date = `${start} - ${end}`;
  const description = "";
  const tags = [
    {
      bgTag: "qcmidnight.400",
      titleTag: "Sponsorship (Gold)",
    },
    {
      bgTag: "blue.300",
      titleTag: "Booth",
    },
    {
      bgTag: "purple.300",
      titleTag: "Workshop",
    },
    {
      bgTag: "qcmidnight.400",
      titleTag: "Recruitment",
    },
  ];

  const textColor = useColorModeValue("gray.700", "white.300");
  const bgIconColor = useColorModeValue("white.300", "gray.700");

  return (
    <Flex alignItems="center" minH="150px" justifyContent="start" mb="5px" pl={3}>
      <Flex direction="column" h="100%">
        <Icon
          as={logo}
          bg={bgIconColor}
          color={color}
          h={"30px"}
          w={"26px"}
          pe="6px"
          zIndex="1"
          position="relative"
          right={document.documentElement.dir === "rtl" ? "-8px" : ""}
          left={document.documentElement.dir === "rtl" ? "" : "-8px"}
        />
        <Box
          w="2px"
          bg={color || "gray.200"}
          h={"100%"}
        ></Box>
      </Flex>
      <Flex direction="column" justifyContent="flex-start" h="100%" width={'100%'}>
        <NavLink to={`/admin/event/${event.id}`}>
          <Text
            fontSize="sm"
            color={color || textColor}
            fontWeight="bold"
          >
            {elipses(title, 45)}
          </Text>
        </NavLink >
        <Text fontSize="sm" color="gray.500" fontWeight="normal">
          {date}
        </Text>
        {description !== undefined ? (
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="normal"
            mb="6px"
            maxW="70%"
          >
            {description}
          </Text>
        ) : null}

        <Flex width={'100%'}>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="bold"
            mr={2}
          >
            Location:
          </Text>
          {data.location !== undefined ? (
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="normal"
            >
              {`${data.location?.value} - ${data.type?.value}`}
            </Text>) : null}
        </Flex>

        <Flex width={'100%'}>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="bold"
            mb={2}
            mr={2}
            maxW="50%"
          >
            Stakeholder:
          </Text>
          {data.stakeholder !== undefined ? (
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="normal"
              mb={2}
              maxW="50%"
            >
              {data.stakeholder?.value}
            </Text>
          ) : null}
        </Flex>
        {/* <Flex width={'100%'}>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="bold"
            mb={2}
            mr={2}
            maxW="50%"
          >
            Open To Do Items:
          </Text>
          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="normal"
            mb={2}
            maxW="50%"
          >
            {3}
          </Text>
        </Flex> */}
        <Stack direction="row" spacing="6px" wrap={'wrap'}>
          {category?.get('value') && <Tag
            bg={category?.get('color')}
            fontSize="xs"
            size="md"
            color="#fff"
            mb="16px"
            borderRadius="15px"
            alignSelf="flex-start"
            key={index}
          >
            {category?.get('value')}
          </Tag>}
        </Stack>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
