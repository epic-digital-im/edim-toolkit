import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  HStack,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import { useContainer as useAuth } from '../../../providers/auth';
import toJson from '../../../utils/toJson';

import { useColorPalette } from "@app/theme";

const ProfileWidget = ({ location, isCustomer }: { location: any, isCustomer?: boolean }) => {
  const { textColor } = useColorPalette();
  const { user, logout, isAuthenticated } = useAuth();
  const userData = toJson(user);

  if (!isAuthenticated) return null;

  return (
    <Menu position={'relative'}>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        _hover={{
          textDecoration: 'none'
        }}
        minW={0}>
        <HStack>
          <Text
            color={textColor}
            display={{ 'sm': 'none', 'md': 'block' }}
          >
            {userData.email}
          </Text>
          <Avatar
            size={'sm'}
            src={null}
            backgroundColor={'qcmidnight.400'}
          />
        </HStack>
      </MenuButton>
      <MenuList alignItems={'center'}>
        <br />
        <Center>
          <Avatar
            size={'md'}
            src={null}
          />
        </Center>
        <br />
        <Center>
          <Text color={textColor}>{userData.email}</Text>
        </Center>
        <br />
        <MenuDivider />
        {!isCustomer && <MenuItem>
          <NavLink to={`/admin/user/${user?.id}`}>
            Account Settings
          </NavLink>
        </MenuItem>}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </MenuList>
    </Menu>

  );
}

export default ProfileWidget;