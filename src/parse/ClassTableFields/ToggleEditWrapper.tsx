import React, { useRef } from "react";
import { Box, ChakraComponent } from "@chakra-ui/react";
import useDoubleClick from '../../hooks/useDoubleClick';

interface ToggleEditWrapperProps extends ChakraComponent<"div"> {
  value: string;
  editable?: boolean;
  rowEditable: boolean;
  setRowEditable: (value?: boolean) => void;
}

const ToggleEditWrapper: React.FC<ToggleEditWrapperProps> = (props) => {
  const { value, setRowEditable, editable, ...rest } = props;

  const buttonRef = useRef();

  useDoubleClick({
    onSingleClick: (e) => {
      setRowEditable(true);
    },
    onDoubleClick: e => {
      if (editable) {
        setRowEditable();
      }
    },
    ref: buttonRef,
    latency: 250
  });

  return (
    <Box ref={buttonRef} {...rest} cursor={'copy'}>
      {value}
    </Box>
  );
}

export default ToggleEditWrapper;