import {
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import headerBgImage from "../assets/img/showcase-01.jpeg";
import { useColorPalette } from "../hooks";

const PageHeader: React.FC<{ title: string }> = ({ title }) => {
  const {
    textColor,
    bgProfile,
    borderProfileColor
  } = useColorPalette();

  return (
    <Box
      mb={{ sm: "205px", md: "80px", xl: "80px" }}
      borderRadius="15px"
      px="0px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        bgImage={headerBgImage}
        w="100%"
        h="150px"
        borderRadius="25px"
        bgPosition="bottom center"
        bgSize="cover"
        bgRepeat="no-repeat"
        position="relative"
        display="flex"
        justifyContent="center"
      >
        <Flex
          direction={{ sm: "column", md: "row" }}
          mx="1.5rem"
          maxH="330px"
          w={{ sm: "90%", xl: "95%" }}
          justifyContent={{ sm: "center", md: "space-between" }}
          align="center"
          backdropFilter="saturate(200%) blur(50px)"
          position="absolute"
          boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
          border="2px solid"
          borderColor={borderProfileColor}
          bg={bgProfile}
          p="24px"
          borderRadius="20px"
          transform={{
            sm: "translateY(45%)",
            md: "translateY(110%)",
            lg: "translateY(50%)",
          }}
        >
          <Flex
            align="center"
            mb={{ sm: "10px", md: "0px" }}
            direction={{ sm: "column", md: "row" }}
            w={{ sm: "100%" }}
            textAlign={{ sm: "center", md: "start" }}
          >
            <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
              <Text
                fontSize={{ sm: "lg", lg: "xl" }}
                color={textColor}
                fontWeight="bold"
                ms={{ sm: "8px", md: "0px" }}
              >
                {title}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default PageHeader;