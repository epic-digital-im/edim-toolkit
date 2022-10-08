import React, { ReactComponentElement, useRef } from 'react';
import { Box, ChakraComponent, Icon, IconButton } from '@chakra-ui/react';

interface PickFileButtonProps extends ChakraComponent<"div"> {
  icon: ReactComponentElement<typeof Icon>;
  type: string;
  onChange: (file: File | string) => void;
}

export const PickFileButton: React.FC<PickFileButtonProps> = ({ icon, type, onChange, ...props }) => {
  const FileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  }

  const acceptMap = {
    csv: '.csv',
    json: '.json',
    image: 'image/*',
  }

  const accept = acceptMap[type] || '*';

  return (
    <Box {...props}>
      <IconButton
        size={"md"}
        icon={icon}
        onClick={() => {
          console.log('click');
          FileRef.current?.click()
        }}
        aria-label={"Import Data"}
        mx={'0.5rem'}
      />
      <input
        style={{ width: 1, height: 1, position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}
        ref={FileRef}
        type="file"
        accept={accept}
        onChange={handleChange}
      />
    </Box>
  )
}

export default PickFileButton;