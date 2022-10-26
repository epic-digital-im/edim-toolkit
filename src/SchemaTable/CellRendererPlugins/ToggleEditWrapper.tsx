import React, { useRef } from "react";
import { Box, ChakraComponent } from "@chakra-ui/react";
import useDoubleClick from '../../hooks/useDoubleClick';

interface ToggleEditWrapperProps extends ChakraComponent<"div"> {
  value: string;
  rowEditable: boolean;
  setRowEditable: (value?: boolean) => void;
}

const ToggleEditWrapper: React.FC<ToggleEditWrapperProps> = (props) => {
  const { value, setRowEditable, ...rest } = props;
  const buttonRef = useRef();

  useDoubleClick({
    onSingleClick: (e) => {
      setRowEditable(true)
    },
    onDoubleClick: e => {
      setRowEditable()
    },
    ref: buttonRef,
    latency: 250
  });

  if (value === undefined) {
    return null;
  }

  return (
    <Box ref={buttonRef} {...rest}>
      {value}
    </Box>
  );
}

export default ToggleEditWrapper;