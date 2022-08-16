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
import { useState } from "react";
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
import routes from "../../routes";
import EpicLogo from "../EpicLogo";

import { navbarBgGradients } from "../../theme/styles";

export default function AuthNavbar(props) {
  const [open, setOpen] = useState(false);

  const textColor = useColorModeValue("gray.700", "#fff");
  const { logo, logoText, secondary, ...rest } = props;

  let navbarBg = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );

  let authObject = {};
  routes.forEach((route) => {
    if (route.items) {
      authObject = route.items.find((link) => link.name === "Authentication");
    }
  });

  let applicationsObject = {};
  routes.forEach((route) => {
    if (route.items) {
      applicationsObject = route.items.find(
        (link) => link.name === "Applications"
      );
    }
  });

  let ecommerceObject = {};
  routes.forEach((route) => {
    if (route.items) {
      ecommerceObject = route.items.find((link) => link.name === "Ecommerce");
    }
  });

  let extraArr = [];
  routes.forEach((route) => {
    route.items &&
      route.items.forEach((item) => {
        if (item.items && item.name === "Pages") {
          extraArr = item.items.filter((link) => !link.collapse);
        }
      });
  });

  // verifies if routeName is the one active (in browser input)

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

  const createPagesLinks = (routes) => {
    return (
      routes &&
      routes.map((link) => {
        console.log(link);
        if (link.hidden) return null;
        if (
          link.name === "Applications" ||
          link.name === "Ecommerce" ||
          link.name === "Authentication" ||
          link.name === "RTL" ||
          link.name === "Widgets" ||
          link.name === "Charts" ||
          link.name === "Alerts"
        ) {
          return;
        }
        if (link.name === "Pricing Page") {
          return (
            <Stack key={link.layout + link.path} direction="column">
              <Stack
                direction="row"
                spacing="6px"
                align="center"
                mb="6px"
                cursor="default"
              >
                <IconBox bg="qcmidnight.400" color="white" h="30px" w="30px">
                  <RocketIcon color="inherit" />
                </IconBox>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                  Extra
                </Text>
              </Stack>
              {createExtraLinks(extraArr)}
            </Stack>
          );
        }
        if (link.authIcon) {
          return (
            <Stack key={link.layout + link.path} direction="column">
              <Stack
                direction="row"
                spacing="6px"
                align="center"
                mb="6px"
                cursor="default"
              >
                <IconBox bg="qcmidnight.400" color="white" h="30px" w="30px">
                  {link.authIcon}
                </IconBox>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                  {link.name}
                </Text>
              </Stack>
              {createPagesLinks(link.items)}
            </Stack>
          );
        } else {
          if (link.component) {
            return (
              <NavLink
                key={link.layout + link.path}
                to={link.layout + link.path}
              >
                <MenuItem
                  ps="36px"
                  py="0px"
                  _hover={{ boxShadow: "none", bg: "none" }}
                  borderRadius="12px"
                >
                  <Text color="gray.400" fontSize="sm" fontWeight="normal">
                    {link.name}
                  </Text>
                </MenuItem>
              </NavLink>
            );
          } else {
            return <>{createPagesLinks(link.items)}</>;
          }
        }
      })
    );
  };

  const createExtraLinks = (routes) => {
    return routes.map((link) => {
      return (
        <NavLink key={link.layout + link.path} to={link.layout + link.path}>
          <MenuItem
            ps="36px"
            py="0px"
            _hover={{ boxShadow: "none", bg: "none" }}
            borderRadius="12px"
          >
            <Text color="gray.400" fontSize="sm" fontWeight="normal">
              {link.name}
            </Text>
          </MenuItem>
        </NavLink>
      );
    });
  };

  const createAuthLinks = (routes) => {
    return routes.map((link) => {
      if (link.hidden) return null;
      if (link.authIcon) {
        return (
          <Stack key={link.layout + link.path} direction="column">
            <Stack
              direction="row"
              spacing="6px"
              align="center"
              mb="6px"
              cursor="default"
            >
              <IconBox bg="qcmidnight.400" color="white" h="30px" w="30px">
                {link.authIcon}
              </IconBox>
              <Text fontWeight="bold" fontSize="sm" color={textColor}>
                {link.name}
              </Text>
            </Stack>
            {createAuthLinks(link.items)}
          </Stack>
        );
      } else {
        return (
          <NavLink key={link.layout + link.path} to={link.layout + link.path}>
            <MenuItem
              ps="36px"
              py="0px"
              _hover={{ boxShadow: "none", bg: "none" }}
              borderRadius="12px"
            >
              <Text color="gray.400" fontSize="sm" fontWeight="normal">
                {link.name}
              </Text>
            </MenuItem>
          </NavLink>
        );
      }
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
        <Flex direction={'row'} alignItems={'center'}>
          <EpicLogo h={"35px"} w={"auto"} me="10px" /> Epic Digital | Interactive Media
        </Flex>
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
    >
      <Flex w="100%" justifyContent={{ sm: "start", lg: "space-between" }}>
        {brand}
        <Box ms={{ base: "auto", lg: "0px" }} display={{ lg: "none" }}>
          <SidebarResponsive
            logoText={props.logoText}
            secondary={props.secondary}
            routes={routes}
            {...rest}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  brandText: PropTypes.string,
};
