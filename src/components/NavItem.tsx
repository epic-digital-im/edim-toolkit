import React from 'react'

import {
  Flex,
  Icon,
  Link,
  FlexProps,
} from '@chakra-ui/react';


import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  selected?: boolean;
}
const NavItem = ({ icon, children, selected, ...rest }: NavItemProps) => {
  let active = (selected) ? { bg: 'cyan.400', color: 'white', } : {};
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...active}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export default NavItem;
