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

// Chakra Imports
import { Box, Text } from "@chakra-ui/react";
import { HSeparator } from "../Separator/Separator";
import PropTypes from "prop-types";

import { useContainer as useAuth } from "../../providers/auth";

import Configurator from "./Configurator";

export default function RunnerConfigurator(props) {
  const { logout } = useAuth();
  return (
    <Configurator
      {...props}
      custom={() => {
        return (
          <>
            <HSeparator />
            <Box mt="24px">
              <Text fontSize="md" fontWeight="600">
                Staff Confguration
              </Text>
              <Text fontSize="sm" mb="16px">
                Select a runner to view app as.
              </Text>
            </Box>
          </>
        );
      }}
    />
  );
}

RunnerConfigurator.propTypes = {
  secondary: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  fixed: PropTypes.bool,
};
