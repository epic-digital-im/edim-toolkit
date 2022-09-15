// Chakra Imports
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Icon,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { SidebarContext } from "../../contexts/SidebarContext";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import AdminNavbarLinks from "./AdminNavbarLinks";

import { navbarBgGradients } from "../../theme/styles";

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const {
    sidebarWidth,
    setSidebarWidth,
    toggleSidebar,
    setToggleSidebar,
  } = useContext(SidebarContext);
  const {
    variant,
    children,
    fixed,
    secondary,
    brandText,
    onOpen,
    ...rest
  } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("gray.700", "gray.200");
  let secondaryText = useColorModeValue("gray.400", "gray.200");
  let navbarPosition = "absolute";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(21px)";
  let navbarShadow = "none";
  let navbarBg = "none";
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingS = "15px";
  let paddingX = "15px";
  if (props.fixed === true)
    if (scrolled === true) {
      navbarPosition = "fixed";
      navbarShadow = useColorModeValue(
        "0px 7px 23px rgba(0, 0, 0, 0.05)",
        "none"
      );
      navbarBg = useColorModeValue(
        navbarBgGradients.light,
        navbarBgGradients.dark
      );
      navbarBorder = useColorModeValue("#FFFFFF", "rgba(255, 255, 255, 0.31)");
      navbarFilter = useColorModeValue(
        "none",
        "drop-shadow(0px 7px 23px rgba(0, 0, 0, 0.05))"
      );
    }
  if (props.secondary) {
    navbarBackdrop = "none";
    navbarPosition = "absolute";
    mainText = "white";
    secondaryText = "white";
    secondaryMargin = "22px";
    paddingS = "40px";
    paddingX = "30px";
  }
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  window.addEventListener("scroll", changeNavbar);
  return (
    <Flex
      position={navbarPosition}
      zIndex={1000}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      borderRadius="16px"
      display="flex"
      minH={{
        sm: "60px",
        md: "75px",
      }}
      left={{
        sm: "0px",
        base: document.documentElement.dir === "rtl" ? "30px" : "",
        md: document.documentElement.dir === "rtl" ? "30px" : "",
      }}
      right={document.documentElement.dir === "rtl" ? "" : "30px"}
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb={0}
      px={{
        sm: paddingX,
        md: "30px",
      }}
      ps={{
        sm: paddingS,
        md: "20px",
      }}
      pt="8px"
      top={{
        base: "18px",
        sm: 0,
        md: "18px",
      }}
      w={{
        base: "100%",
        sm: "100%",
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
      >
        {/* <Box mb={{ sm: "8px", md: "0px" }}>
          <Breadcrumb>
            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="#" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="#" color={mainText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            _hover={{ color: { mainText } }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {brandText}
          </Link>
        </Box> */}
        {/* {toggleSidebar ? (
          <Icon
            as={CgMenuRight}
            w="100px"
            h="20px"
            ms="20px"
            cursor="pointer"
            display={{ sm: "none", xl: "block" }}
            onClick={() => {
              setSidebarWidth(sidebarWidth === 275 ? 120 : 275);
              setToggleSidebar(!toggleSidebar);
            }}
          />
        ) : (
          <HamburgerIcon
            w="100px"
            h="20px"
            ms="20px"
            color={props.secondary ? "white" : mainText}
            cursor="pointer"
            display={{ sm: "none", xl: "block" }}
            onClick={() => {
              setSidebarWidth(sidebarWidth === 275 ? 120 : 275);
              setToggleSidebar(!toggleSidebar);
            }}
          />
        )} */}
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
