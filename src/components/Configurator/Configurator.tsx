import { useRef } from 'react';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { HSeparator } from "../Separator/Separator";
import PropTypes from "prop-types";
import React from "react";

import { useContainer as useAuth } from "../../providers/auth";

export default function Configurator(props) {
  const { logout } = useAuth();
  const { secondary, isOpen, onClose, fixed, custom, ...rest } = props;

  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  let fixedDisplay = "flex";
  if (props.secondary) {
    fixedDisplay = "none";
  }

  const settingsRef = useRef();
  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        onClose={props.onClose}
        placement={document.documentElement.dir === "rtl" ? "left" : "right"}
        finalFocusRef={settingsRef}
        blockScrollOnMount={false}
      >
        <DrawerContent>
          <DrawerHeader pt="24px" px="24px">
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" mt="16px">
              UI Configuration
            </Text>
            <Text fontSize="md" mb="16px">
              See your ui options.
            </Text>
            <HSeparator />
          </DrawerHeader>
          <DrawerBody w="340px" ps="24px" pe="40px">
            <Flex flexDirection="column">
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="24px"
              >
                <Text fontSize="md" fontWeight="600" mb="4px">
                  Dark/Light
                </Text>
                <Button onClick={toggleColorMode}>
                  Toggle {colorMode === "light" ? "Dark" : "Light"}
                </Button>
              </Flex>

              <HSeparator />

              <Box mt="24px">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  mb="24px"
                >
                  <Button width={"100%"} onClick={logout}>
                    Sign Out
                  </Button>
                </Flex>
              </Box>

              {custom && custom()}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
Configurator.propTypes = {
  secondary: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  fixed: PropTypes.bool,
  custom: PropTypes.func,
};
