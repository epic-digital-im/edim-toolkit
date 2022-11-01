import React from 'react';
import { Spinner, Box, Flex } from '@chakra-ui/react';

export const LoadingOverlay = ({ isLoading, color }: { isLoading?: boolean, color?: string }) => {
  return (isLoading ?? true) ? (
    <Box position={'absolute'} top={0} left={0} width={'100%'} height={'100%'} zIndex={1000}>
      <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'}>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color={color || 'blue.500'}
          size='xl'
        />
      </Flex>
    </Box>
  ) : null;
}

export default LoadingOverlay;