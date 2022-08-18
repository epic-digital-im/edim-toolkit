import {
  Button,
  Text,
  useColorModeValue,
  ComponentWithAs,
  ButtonProps,
} from "@chakra-ui/react";

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
  const textColor = useColorModeValue("white", "black");
  const buttonBg = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "gray.100"
  );
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

export const BackButton = ({ disabled, loading, label, size, fontSize, ...rest }: FormButtonProps) => {
  const textColor = useColorModeValue("black", "white");
  const bgPrevButton = useColorModeValue("gray.100", "gray.100");
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
