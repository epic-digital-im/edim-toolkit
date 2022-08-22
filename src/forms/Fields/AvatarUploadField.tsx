import React, { useRef } from 'react';
import { Box, Avatar, ChakraComponent, useDisclosure } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useColorPalette } from '@app/theme';
import { ParseFilePropUpdater } from '../../parse/PropUpdater';

interface AvatarUploadFieldProps extends ChakraComponent<"div"> {
  value: string;
  onChange: (value: string) => void;
}

export const AvatarUploadInput: React.FC<AvatarUploadFieldProps> = ({ value, onChange, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bgColor } = useColorPalette();
  const FileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onChange) onChange(file);
    }
  }

  return (
    <Box position={'relative'} {...props}>
      <Avatar
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        src={value && value?.url()}
        background={bgColor}
        w="80px"
        h="80px"
        me="22px"
        borderRadius="15px"
        onClick={() => FileRef.current?.click()}
        cursor="pointer"
      />
      {isOpen && <EditIcon position={'absolute'} top={'2px'} right={'24px'} />}
      <input
        style={{ width: 1, height: 1, position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}
        ref={FileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </Box>
  )
}

export const AvatarPropUpdater = (props: AvatarUploadFieldProps) => {
  return (
    <ParseFilePropUpdater {...props}>
      {({ onChange, value }) => {
        return (
          <AvatarUploadInput value={value} onChange={onChange} />
        )
      }}
    </ParseFilePropUpdater>
  )
}