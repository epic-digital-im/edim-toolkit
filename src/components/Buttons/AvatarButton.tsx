import React from 'react';
import { Box, Avatar, Text, Flex, useColorModeValue } from "@chakra-ui/react";

// import avatar1 from "../../assets/img/avatars/avatar1.png";

interface AvatarButtonProps {
  itemId: number;
  type: string;
}

export const AvatarButton = ({ itemId, type }: AvatarButtonProps) => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Box minWidth={{ sm: "250px" }} ps="0px" >
      <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
        <Avatar src={""} w="50px" borderRadius="12px" me="18px" />
        <Text
          fontSize="md"
          color={textColor}
          fontWeight="bold"
          minWidth="100%"
        >
          Spencer Thornock
        </Text>
      </Flex>
    </Box>
  )
}

export default AvatarButton;