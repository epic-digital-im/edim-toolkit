import React from 'react';
import { Box, Avatar, Text, Flex } from "@chakra-ui/react";
import { useColorPalette } from '@app/theme';

interface AvatarButtonProps {
  name: string;
  avatarUrl: string;
}

export const AvatarButton = ({ avatarUrl, name }: AvatarButtonProps) => {
  const { textColor } = useColorPalette();
  return (
    <Box minWidth={{ sm: "250px" }} ps="0px" >
      <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
        <Avatar src={avatarUrl} w="50px" borderRadius="12px" me="18px" />
        <Text
          fontSize="md"
          color={textColor}
          fontWeight="bold"
          minWidth="100%"
        >
          {name}
        </Text>
      </Flex>
    </Box>
  )
}

export default AvatarButton;