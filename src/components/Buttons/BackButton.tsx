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

export const BackButton = ({ disabled, loading, label, size, fontSize, ...rest }: FormButtonProps) => {
  const { textColor, bgPrevButton } = useColorPalette();
  return (
    <Button
      bg={bgPrevButton}
      alignSelf="flex-end"
      size={size || 'lg'}
      disabled={disabled || loading}
      isLoading={loading}
      {...rest}
    >
      <Text fontSize={fontSize || 'md'} color={textColor} fontWeight="bold">
        {label}
      </Text>
    </Button>
  )
}
