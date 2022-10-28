import React, { useState } from "react";
import { Flex, IconButton, ChakraComponent } from "@chakra-ui/react";
import { EditIcon } from '@chakra-ui/icons';
import useKeyPress from '../../hooks/useKeyPress';

interface ToggleEditWrapperProps extends ChakraComponent<typeof Flex> {
  value: string;
  editable: boolean;
  setRowEditable: (value?: boolean) => void;
  setCellEditable?: (value?: boolean) => void;
}

const ToggleEditWrapper: React.FC<ToggleEditWrapperProps> = (props) => {
  const [cellEditable, setCellEditable] = useState(false);
  const { children, value, editable, ...rest } = props;

  useKeyPress("Escape", () => {
    setCellEditable(false)
  });


  if (value === undefined) {
    return null;
  }
  if (typeof value === 'object') {
    // return JSON.stringify(value);
    return null;
  }

  return (
    <Flex
      cursor={editable ? 'pointer' : 'default'}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      height={'100%'}
      role="group"
      {...rest}>
      {cellEditable ? children : (
        <>
          {value}
          {editable && (<IconButton
            onClick={() => {
              if (!setCellEditable) return;
              setCellEditable(true)
            }}
            visibility={'hidden'}
            _groupHover={{ visibility: 'visible' }}
            size={'sm'}
            backgroundColor={'transparent'}
            aria-label="Edit" icon={<EditIcon />}
          />)}
        </>
      )}
    </Flex>
  );
}

export default ToggleEditWrapper;