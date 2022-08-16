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

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Link,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import bgCard from "../../assets/img/background-card-reports.png";
import IconBox from "../Icons/IconBox";
import { CreativeTimLogo, RocketIcon } from "../Icons/Icons";
import { SidebarResponsive } from "../Sidebar/Sidebar";
import PropTypes from "prop-types";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { GoChevronDown } from "react-icons/go";
import { NavLink } from "react-router-dom";
import routes from "../../routes-customer";
import EpicLogo from "../EpicLogo";

import { navbarBgGradients } from "../../theme/styles";

import ProfileWidget from "./ProfileWidget";

export default function CustomerNavbar(props) {
  const textColor = useColorModeValue("gray.700", "#fff");
  const { logo, logoText, secondary, history, ...rest } = props;

  let navbarBg = useColorModeValue(
    navbarBgGradients.light,
    navbarBgGradients.dark
  );

  // Chakra color mode
  let mainText = useColorModeValue("gray.700", "gray.200");

  let navbarBorder = useColorModeValue(
    "1.5px solid` #FFFFFF",
    "1.5px solid rgba(255, 255, 255, 0.31)"
  );
  let navbarShadow = useColorModeValue(
    "0px 7px 23px rgba(0, 0, 0, 0.05)",
    "none"
  );
  let navbarFilter = useColorModeValue(
    "none",
    "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
  );
  let navbarBackdrop = "blur(21px)";
  let bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.800"
  );
  let navbarPosition = "fixed";
  let colorButton = "white";
  if (props.secondary === true) {
    navbarBg = "none";
    navbarBorder = "none";
    navbarShadow = "initial";
    navbarFilter = "initial";
    navbarBackdrop = "none";
    bgButton = "black";
    colorButton = "gray.700";
    mainText = "#fff";
    navbarPosition = "absolute";
  }

  const createApplicationLinks = (routes) => {
    return routes.map((link) => {
      if (link.hidden) return null;
      return (
        <NavLink key={link.layout + link.path} to={link.layout + link.path}>
          <Stack direction="row" spacing="12px" align="center" cursor="pointer">
            <Text fontWeight="bold" fontSize="sm" color={textColor}>
              {link.name}
            </Text>
          </Stack>
        </NavLink>
      );
    });
  };

  var brand = (
    <Box
      display="flex"
      lineHeight="100%"
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      color={mainText}
    >
      <NavLink to="/">
        <EpicLogo h={"36px"} w={"auto"} me="10px" />
      </NavLink>
    </Box>
  );

  return (
    <Flex
      position={navbarPosition}
      top="16px"
      left="50%"
      transform="translate(-50%, 0px)"
      background={navbarBg}
      border={navbarBorder}
      boxShadow={navbarShadow}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderRadius="15px"
      px="16px"
      py="22px"
      mx="auto"
      width="1044px"
      maxW="90%"
      alignItems="center"
      zIndex={1000}
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
        {brand}
        <Box ms={{ base: "auto", lg: "0px" }} display={{ lg: "none" }}>
          <SidebarResponsive
            logoText={props.logoText}
            secondary={props.secondary}
            routes={routes}
            // logo={logo}
            {...rest}
          />
        </Box>
        <HStack display={{ sm: "none", lg: "flex" }} spacing="24px">
          {createApplicationLinks(routes[0].items)}
        </HStack>
        <ProfileWidget history={history} isCustomer />
      </Flex>
    </Flex>
  );
}

CustomerNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
};
