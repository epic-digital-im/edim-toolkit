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
  const { textColor, bgPrevButton, buttonBg } = useColorPalette();
  return (
    <Button
      variant="no-hover"
      bg={buttonBg}
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
      <Text fontSize={fontSize || 'md'} color={textColor} fontWeight="bold" lineHeight={1}>
        {label}
      </Text>
    </Button>
  )
}
