import { Spinner, Box, Flex } from '@chakra-ui/react';

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (isLoading) ? (
    <Box position={'absolute'} top={0} left={0} width={'100%'} height={'100%'} zIndex={1000}>
      <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'}>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Flex>
    </Box>
  ) : null;
}

export default LoadingOverlay;