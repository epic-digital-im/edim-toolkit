import React from 'react';
import { Avatar, AvatarProps, ComponentWithAs } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useColorPalette } from '@app/theme';

interface ObjectAvatarProps extends ComponentWithAs<"span", AvatarProps> {
  object: Parse.Object<any>;
  linkTo?: (item: Parse.Object<any>) => string;
}

export const ObjectAvatar: React.FC<ObjectAvatarProps> = ({ object, linkTo, ...props }) => {
  const { bgColor } = useColorPalette();
  const avatar = object.get('avatar');
  const avatarUrl = avatar ? avatar.url() : null;
  const Wrapper = linkTo ? NavLink : 'span';
  return (
    <Wrapper to={linkTo ? linkTo(object) : undefined}>
      <Avatar
        src={avatarUrl}
        background={bgColor}
        {...props}
      />
    </Wrapper>
  )
}
