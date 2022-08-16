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
import { Fragment, useRef, useContext } from 'react';
/*eslint-disable*/
import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Link,
  List,
  ListItem,
  Image,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import SidebarHelpImage from "../../assets/img/SidebarHelpImage.png";
import IconBox from "../Icons/IconBox";
import { CreativeTimLogo } from "../Icons/Icons";
import {
  renderThumbDark,
  renderThumbLight,
  renderTrack,
  renderTrackRTL,
  renderView,
  renderViewRTL,
} from "../Scrollbar/Scrollbar";
import { HSeparator } from "../Separator/Separator";
import { SidebarContext } from "../../contexts/SidebarContext";
import PropTypes from "prop-types";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { FaCircle } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

import EpicLogo from "../EpicLogo";

// FUNCTIONS

function Sidebar(props) {
  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const { sidebarWidth, setSidebarWidth, toggleSidebar } = useContext(
    SidebarContext
  );
  const mainPanel = useRef();
  let variantChange = "0.2s linear";
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue("qcmidnight.400", "qcmidnight.400");
    let activeAccordionBg = useColorModeValue("white", "gray.700");
    let inactiveBg = useColorModeValue("white", "gray.700");
    let inactiveColorIcon = useColorModeValue("qcmidnight.400", "qcmidnight.400");
    let activeColorIcon = useColorModeValue("white", "white");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    // Here are all the props that may change depending on sidebar's state.(Opaque or transparent)
    if (sidebarVariant === "opaque") {
      activeBg = useColorModeValue("qcmidnight.400", "qcmidnight.400");
      inactiveBg = useColorModeValue("gray.100", "gray.600");
      activeColor = useColorModeValue("gray.700", "white");
      inactiveColor = useColorModeValue("gray.400", "gray.400");
      sidebarActiveShadow = "none";
    }
    return routes.map((prop, index) => {
      if (prop.hidden) return null;
      if (prop.category) {
        return (
          <Fragment key={`${prop.name}_${index}`}>
            <Text
              fontSize={sidebarWidth === 275 ? "md" : "xs"}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              key={`${prop.name}_${index}`}
            >
              {prop.name}
            </Text>
            {createLinks(prop.items)}
          </Fragment>
        );
      }
      if (prop.collapse) {
        return (
          <Accordion
            allowToggle
            // isOpen={prop.open}
            key={`${prop.name}_${index}`}
            defaultIndex={0}
          >
            <AccordionItem border="none">
              <AccordionButton
                display="flex"
                align="center"
                justify="center"
                boxShadow={
                  activeRoute(prop.path) && prop.icon
                    ? sidebarActiveShadow
                    : null
                }
                _hover={{
                  boxShadow:
                    activeRoute(prop.path) && prop.icon
                      ? sidebarActiveShadow
                      : null,
                }}
                _focus={{
                  boxShadow: "none",
                }}
                borderRadius="15px"
                w={sidebarWidth === 275 ? "100%" : "77%"}
                px={prop.icon ? null : "0px"}
                py={prop.icon ? "12px" : null}
                bg={
                  activeRoute(prop.path) && prop.icon
                    ? activeAccordionBg
                    : "transparent"
                }
              >
                {activeRoute(prop.path) ? (
                  <Box
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    transition={variantChange}
                    mx={{
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    w="100%"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                      border: "none",
                    }}
                    _focus={{
                      transform: "none",
                      borderColor: "transparent",
                      border: "none",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={activeBg}
                          color={activeColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text
                          color={activeColor}
                          my="auto"
                          fontSize="sm"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        >
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack
                        spacing={sidebarWidth === 275 ? "22px" : "0px"}
                        ps={sidebarWidth === 275 ? "10px" : "0px"}
                        ms={sidebarWidth === 275 ? "0px" : "8px"}
                      >
                        <Icon
                          as={FaCircle}
                          w="10px"
                          color="qcmidnight.400"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        />
                        <Text color={activeColor} my="auto" fontSize="sm">
                          {sidebarWidth === 275 ? prop.name : prop.name[0]}
                        </Text>
                      </HStack>
                    )}
                  </Box>
                ) : (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mx={{
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    w="100%"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      borderColor: "transparent",
                      boxShadow: "none",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={inactiveBg}
                          color={inactiveColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                          boxShadow={sidebarActiveShadow}
                          _hover={{ boxShadow: sidebarActiveShadow }}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text
                          color={inactiveColor}
                          my="auto"
                          fontSize="sm"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        >
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack
                        spacing={sidebarWidth === 275 ? "26px" : "0px"}
                        ps={sidebarWidth === 275 ? "10px" : "0px"}
                        ms={sidebarWidth === 275 ? "0px" : "8px"}
                      >
                        <Icon
                          as={FaCircle}
                          w="6px"
                          color="qcmidnight.400"
                          display={sidebarWidth === 275 ? "block" : "none"}
                        />
                        <Text
                          color={inactiveColor}
                          my="auto"
                          fontSize="md"
                          fontWeight="normal"
                        >
                          {sidebarWidth === 275 ? prop.name : prop.name[0]}
                        </Text>
                      </HStack>
                    )}
                  </Button>
                )}
                <AccordionIcon
                  color="gray.400"
                  display={
                    prop.icon
                      ? sidebarWidth === 275
                        ? "block"
                        : "none"
                      : "block"
                  }
                  transform={
                    prop.icon
                      ? null
                      : sidebarWidth === 275
                        ? null
                        : "translateX(-70%)"
                  }
                />
              </AccordionButton>
              <AccordionPanel
                pe={prop.icon ? null : "0px"}
                pb="8px"
                ps={prop.icon ? null : sidebarWidth === 275 ? null : "8px"}
              >
                <List>
                  {
                    prop.icon
                      ? createLinks(prop.items) // for bullet accordion links
                      : createAccordionLinks(prop.items) // for non-bullet accordion links
                  }
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      } else {
        return (
          <NavLink to={prop.layout + prop.path} key={`${prop.name}_${index}`}>
            {prop.icon ? (
              <Box>
                <HStack spacing="14px" py="15px" px="15px">
                  <IconBox
                    bg="qcmidnight.400"
                    color="white"
                    h="30px"
                    w="30px"
                    transition={variantChange}
                  >
                    {prop.icon}
                  </IconBox>
                  <Text
                    color={
                      activeRoute(prop.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={activeRoute(prop.name) ? "bold" : "normal"}
                    fontSize="sm"
                  >
                    {prop.name}
                  </Text>
                </HStack>
              </Box>
            ) : (
              <ListItem>
                <HStack
                  spacing={
                    sidebarWidth === 275
                      ? activeRoute(prop.path.toLowerCase())
                        ? "22px"
                        : "26px"
                      : "8px"
                  }
                  py="5px"
                  px={sidebarWidth === 275 ? "10px" : "0px"}
                >
                  <Icon
                    as={FaCircle}
                    w={activeRoute(prop.path.toLowerCase()) ? "10px" : "6px"}
                    color="qcmidnight.400"
                    display={sidebarWidth === 275 ? "block" : "none"}
                  />
                  <Text
                    color={
                      activeRoute(prop.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(prop.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {sidebarWidth === 275 ? prop.name : prop.name[0]}
                  </Text>
                </HStack>
              </ListItem>
            )}
          </NavLink>
        );
      }
    });
  };

  const createAccordionLinks = (routes) => {
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let activeColor = useColorModeValue("gray.700", "white");
    return routes.map((prop, index) => {
      return !prop.hidden ? (
        <NavLink to={prop.layout + prop.path}>
          <ListItem
            pt="5px"
            ms={sidebarWidth === 275 ? "26px" : "0px"}
            key={`${prop.name}_${index}`}
          >
            <Text
              mb="4px"
              color={
                activeRoute(prop.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
              }
              fontWeight={
                activeRoute(prop.path.toLowerCase()) ? "bold" : "normal"
              }
              fontSize="sm"
            >
              {sidebarWidth === 275 ? prop.name : prop.name[0]}
            </Text>
          </ListItem>
        </NavLink>
      ) : null;
    });
  };
  const { logoText, routes, sidebarVariant } = props;
  let isWindows = navigator.platform.startsWith("Win");
  let links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = "none";
  let sidebarRadius = "0px";
  let sidebarMargins = "0px";
  if (sidebarVariant === "opaque") {
    sidebarBg = useColorModeValue("white", "gray.700");
    sidebarRadius = "16px";
    sidebarMargins = "16px 0px 16px 16px";
  }
  let brand = (
    <Box pt={"25px"} mb="12px">
      <Box
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <NavLink to="/">
          <Flex alignItems={'center'} direction={'column'}>
            <EpicLogo w={"100px"} h={"auto"} mb={3} />
            Epic Digital | Interactive Media
          </Flex>
        </NavLink>
      </Box>
      <HSeparator />
    </Box>
  );

  let sidebarContent = (
    <Box>
      <Box mb="20px">{brand}</Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>
    </Box>
  );

  // SIDEBAR
  return (
    <Box
      position={"relative"}
      zIndex={1000}
      ref={mainPanel}
      onMouseEnter={
        toggleSidebar
          ? () => setSidebarWidth(sidebarWidth === 120 ? 275 : 120)
          : null
      }
      onMouseLeave={
        toggleSidebar
          ? () => setSidebarWidth(sidebarWidth === 275 ? 120 : 275)
          : null
      }
    >
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w={`${sidebarWidth}px`}
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          {isWindows ? (
            <Scrollbars
              autoHide
              renderTrackVertical={
                document.documentElement.dir === "rtl"
                  ? renderTrackRTL
                  : renderTrack
              }
              renderThumbVertical={useColorModeValue(
                renderThumbLight,
                renderThumbDark
              )}
              renderView={
                document.documentElement.dir === "rtl"
                  ? renderViewRTL
                  : renderView
              }
            >
              {sidebarContent}
            </Scrollbars>
          ) : (
            <Box id="sidebarScrollRemove" overflowY="scroll" height="100vh">
              {sidebarContent}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// FUNCTIONS

export function SidebarResponsive(props) {
  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const mainPanel = useRef();
  let variantChange = "0.2s linear";
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue("qcmidnight.400", "qcmidnight.400");
    let activeAccordionBg = useColorModeValue("white", "gray.700");
    let inactiveBg = useColorModeValue("white", "gray.700");
    let inactiveColorIcon = useColorModeValue("qcmidnight.400", "qcmidnight.400");
    let activeColorIcon = useColorModeValue("white", "white");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    // Here are all the props that may change depending on sidebar's state.(Opaque or transparent)
    if (sidebarVariant === "opaque") {
      inactiveBg = useColorModeValue("gray.100", "gray.600");
      activeColor = useColorModeValue("gray.700", "white");
      inactiveColor = useColorModeValue("gray.400", "gray.400");
    }
    return routes.map((prop, index) => {
      if (prop.hidden) return null;
      if (prop.category) {
        return (
          <Fragment key={`${prop.name}_${index}`}>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.items)}
          </Fragment>
        );
      }
      if (prop.collapse) {
        return (
          <Accordion
            allowToggle
            // isOpen={prop.open}
            key={`${prop.name}_${index}`}
          >
            <AccordionItem border="none">
              <AccordionButton
                display="flex"
                align="center"
                justify="center"
                key={`${prop.name}_${index}`}
                borderRadius="15px"
                _focus={{ boxShadow: "none" }}
                _hover={{ boxShadow: "none" }}
                px={prop.icon ? null : "0px"}
                py={prop.icon ? "12px" : null}
                bg={
                  activeRoute(prop.path) && prop.icon
                    ? activeAccordionBg
                    : "transparent"
                }
              >
                {activeRoute(prop.path) ? (
                  <Box
                    as="button"
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    transition={variantChange}
                    mx={{
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={activeBg}
                          color={activeColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text
                          color={activeColor}
                          my="auto"
                          fontSize="sm"
                          display={"block"}
                        >
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack spacing={"22px"} ps="10px" ms="0px">
                        <Icon as={FaCircle} w="10px" color="qcmidnight.400" />
                        <Text color={activeColor} my="auto" fontSize="sm">
                          {prop.name}
                        </Text>
                      </HStack>
                    )}
                  </Box>
                ) : (
                  <Box
                    as="button"
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mx={{
                      xl: "auto",
                    }}
                    px="0px"
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    {prop.icon ? (
                      <Flex>
                        <IconBox
                          bg={inactiveBg}
                          color={inactiveColorIcon}
                          h="30px"
                          w="30px"
                          me="12px"
                          transition={variantChange}
                        >
                          {prop.icon}
                        </IconBox>
                        <Text color={inactiveColor} my="auto" fontSize="sm">
                          {prop.name}
                        </Text>
                      </Flex>
                    ) : (
                      <HStack spacing={"26px"} ps={"10px"} ms={"0px"}>
                        <Icon as={FaCircle} w="6px" color="qcmidnight.400" />
                        <Text
                          color={inactiveColor}
                          my="auto"
                          fontSize="md"
                          fontWeight="normal"
                        >
                          {prop.name}
                        </Text>
                      </HStack>
                    )}
                  </Box>
                )}
                <AccordionIcon color="gray.400" />
              </AccordionButton>
              <AccordionPanel pe={prop.icon ? null : "0px"} pb="8px">
                <List>
                  {
                    prop.icon
                      ? createLinks(prop.items) // for bullet accordion links
                      : createAccordionLinks(prop.items) // for non-bullet accordion links
                  }
                </List>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      } else {
        return (
          <NavLink to={prop.layout + prop.path} key={`${prop.name}_${index}`}>
            {prop.icon ? (
              <Box>
                <HStack spacing="14px" py="15px" px="15px">
                  <IconBox
                    bg="qcmidnight.400"
                    color="white"
                    h="30px"
                    w="30px"
                    transition={variantChange}
                  >
                    {prop.icon}
                  </IconBox>
                  <Text
                    color={
                      activeRoute(prop.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={activeRoute(prop.name) ? "bold" : "normal"}
                    fontSize="sm"
                  >
                    {prop.name}
                  </Text>
                </HStack>
              </Box>
            ) : (
              <ListItem>
                <HStack spacing="22px" py="5px" px="10px">
                  <Icon
                    as={FaCircle}
                    w={activeRoute(prop.path.toLowerCase()) ? "10px" : "6px"}
                    color="qcmidnight.400"
                  />
                  <Text
                    color={
                      activeRoute(prop.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(prop.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {prop.name}
                  </Text>
                </HStack>
              </ListItem>
            )}
          </NavLink>
        );
      }
    });
  };

  const createAccordionLinks = (routes) => {
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let activeColor = useColorModeValue("gray.700", "white");
    return routes.map((prop, index) => {
      if (prop.hidden) return null;
      return (
        <NavLink to={prop.layout + prop.path} key={`${prop.name}_${index}`}>
          <ListItem pt="5px" ms="26px" key={`${prop.name}_${index}`}>
            <Text
              color={
                activeRoute(prop.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
              }
              fontWeight={
                activeRoute(prop.path.toLowerCase()) ? "bold" : "normal"
              }
              fontSize="sm"
            >
              {prop.name}
            </Text>
          </ListItem>
        </NavLink>
      );
    });
  };
  const { logoText, routes } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let hamburgerColor = useColorModeValue("gray.500", "gray.200");
  if (props.secondary === true) {
    hamburgerColor = "white";
  }
  var brand = (
    <Box pt={"35px"} mb="8px">
      <Box
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px"
      >
        <NavLink to="/">
          <EpicLogo w={"175px"} h={"auto"} />
        </NavLink>
      </Box>
      <HSeparator />
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  // Color variables
  return (
    <Box ref={mainPanel} display={props.display}>
      <Box display={{ sm: "block", xl: "none" }}>
        <>
          <HamburgerIcon
            color={hamburgerColor}
            w="18px"
            h="18px"
            me="16px"
            ref={btnRef}
            cursor="pointer"
            onClick={onOpen}
          />
          <Drawer
            placement={
              document.documentElement.dir === "rtl" ? "right" : "left"
            }
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent
              w="250px"
              maxW="250px"
              ms={{
                sm: "16px",
              }}
              my={{
                sm: "16px",
              }}
              borderRadius="16px"
            >
              <DrawerCloseButton
                _focus={{ boxShadow: "none" }}
                _hover={{ boxShadow: "none" }}
              />
              <DrawerBody maxW="250px" px="1rem">
                <Box maxW="100%" h="100vh">
                  <Box mb="20px">{brand}</Box>
                  <Stack direction="column" mb="40px">
                    <Box>{links}</Box>
                  </Stack>
                  <Flex
                    borderRadius="15px"
                    flexDirection="column"
                    bgImage={SidebarHelpImage}
                    justifyContent="flex-start"
                    alignItems="start"
                    boxSize="border-box"
                    p="16px"
                    h="170px"
                    w="100%"
                  >
                    <IconBox width="35px" h="35px" bg="white" mb="auto">
                      <QuestionIcon color="qcmidnight.400" h="18px" w="18px" />
                    </IconBox>
                    <Text
                      fontSize="sm"
                      color="white"
                      fontWeight="bold"
                      display="block"
                    >
                      Need help?
                    </Text>
                    <Text fontSize="xs" color="white" mb="10px" display="block">
                      Please check our docs
                    </Text>
                    <Link
                      w="100%"
                      href="https://demos.creative-tim.com/docs-purity-ui-dashboard/"
                    >
                      <Button
                        fontSize="10px"
                        fontWeight="bold"
                        w="100%"
                        bg="white"
                        _hover="none"
                        _active={{
                          bg: "white",
                          transform: "none",
                          borderColor: "transparent",
                        }}
                        _focus={{
                          boxShadow: "none",
                        }}
                        color="black"
                        display="block"
                      >
                        DOCUMENTATION
                      </Button>
                    </Link>
                  </Flex>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      </Box>
    </Box>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};
SidebarResponsive.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidebar;
