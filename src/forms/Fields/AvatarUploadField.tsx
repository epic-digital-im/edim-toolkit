import React, { useRef } from 'react';
import { Box, Avatar, ChakraComponent, useDisclosure } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useColorPalette } from '@app/theme';
import { ParseFilePropUpdater } from '../../SchemaTable/PropUpdater';
import { LoadingOverlay } from '../../components/Loaders/LoadingOverlay';

interface AvatarUploadFieldProps extends ChakraComponent<"div"> {
  object: Parse.User;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const AvatarUploadInput: React.FC<AvatarUploadFieldProps> = ({ value, onChange, isLoading, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bgColor } = useColorPalette();
  const FileRef = useRef<HTMLInputElement>(null);
  const avatarUrl = value && value?.url();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onChange) onChange(file);
    }
  }

  return (
    <Box position={'relative'} w="80px" h="80px" mr={3} {...props}>
      <Avatar
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        src={avatarUrl}
        background={avatarUrl ? bgColor : null}
        w="80px"
        h="80px"
        me="22px"
        borderRadius="15px"
        onClick={() => {
          console.log('click');
          FileRef.current?.click()
        }}
        cursor="pointer"
      />
      <LoadingOverlay isLoading={isLoading} />
      {isOpen && <EditIcon color={'white'} position={'absolute'} top={'2px'} right={'2px'} />}
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
      {({ onChange, value, isLoading }) => {
        return (
          <AvatarUploadInput value={value} onChange={onChange} isLoading={isLoading} />
        )
      }}
    </ParseFilePropUpdater>
  )
}