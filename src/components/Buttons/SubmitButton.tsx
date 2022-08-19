import React from 'react';

import {
  Button,
  Text,
} from "@chakra-ui/react";

import { useColorPalette } from "@app/theme";

interface FormButtonProps {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  size?: string;
  fontSize?: string;
  mr?: string;
  onClick?: () => void;
  alignSelf?: string;
}

export const SubmitButton = ({ disabled, loading, label, size, fontSize, ...rest }: FormButtonProps) => {
  const { buttonTextPrimary, buttonBgPrimary } = useColorPalette();
  return (
    <Button
      variant="no-hover"
      bg={buttonBgPrimary}
      color={'white'}
      alignSelf="flex-end"
      type="submit"
      size={size || 'lg'}
      _disabled={{ opacity: 0.75 }}
      _hover={{ opacity: 0.75 }}
      {...rest}
      disabled={disabled || loading}
      isLoading={loading}
    >
      <Text fontSize={fontSize || 'md'} color={buttonTextPrimary} fontWeight="bold" lineHeight={1}>
        {label || 'Save'}
      </Text>
    </Button>
  )
}
