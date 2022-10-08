import Parse from 'parse/dist/parse.min.js';
import moment from 'moment';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  Card,
  CardBody,
  CardHeader,
  ParseCollectionLiveQuery,
  LoadingOverlay,
  DeleteButton,
  EditorInput,
  ObjectAvatar,
} from "@epicdm/toolkit";

import { ClassNames } from '@app/shared/types'

import { HSeparator } from "../Separator/Separator";

import React, { useEffect, useState } from "react";

import { NavLink } from 'react-router-dom';

import { useColorPalette } from '@app/theme';

interface DiscussionProps {
  title?: string;
  object: Parse.Object<any>;
  isDialog?: boolean
  context: string;
  onCreate?: () => void;
}

export const Discussion = ({ title, object, context, onCreate, isDialog }: DiscussionProps) => {
  const toast = useToast();
  const currentUser = Parse.User.current();
  const [value, setValue] = useState('');
  const { textColor } = useColorPalette();

  const filters = [
    {
      method: 'equalTo',
      value: object.id,
      prop: 'subjectId',
    },
  ];

  if (context) {
    filters.push({
      method: 'equalTo',
      value: context,
      prop: 'context',
    });
  }

  const counts = object.get('commentCount') || {};
  const commentCount = (context)
    ? counts[context] || 0
    : counts['count'] || 0;

  return (
    <ParseCollectionLiveQuery
      objectClass={ClassNames.Comment}
      include={['user']}
      filter={filters}
      isLongPolling
    >
      {({ data, isLoading, isError }) => {
        const [localData, setLocalData] = useState(data);
        const [isShiftDown, setIsShiftDown] = useState(false);

        const onChange = (value) => {
          setValue(value);
        }

        useEffect(() => {
          setLocalData(data);
        }, [data])

        const handleCreateComment = async () => {
          try {
            const CommentClass = Parse.Object.extend(ClassNames.Comment);
            const comment = new CommentClass();
            comment.set('comment', value);
            comment.set('subjectId', object.id);
            comment.set('subjectClass', object.className);
            comment.set('context', context);
            console.log(context);
            await comment.save()
            setValue('');
            if (onCreate) onCreate();
            setLocalData([...localData, comment]);
            toast({
              title: 'Comment created',
              description: 'Your comment has been created successfully',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } catch (err) {
            toast({
              title: 'Error',
              description: err.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }

        const handleKeyDown = (event) => {
          // if is shift key
          if (event.keyCode === 16) {
            setIsShiftDown(true);
          }
        }

        const handleKeyUp = (event) => {
          // if is enter key
          console.log(isShiftDown, event.keyCode);
          if (event.keyCode === 16) {
            setIsShiftDown(false);
          }
          if (isShiftDown && event.keyCode === 13) {
            handleCreateComment();
          }
        }

        if (isLoading) return <LoadingOverlay isLoading={isLoading} />;

        return (
          <Card>
            {!isDialog && (
              <>
                <CardHeader>
                  <Flex justify="space-between" w="100%">
                    <Text color={textColor} fontSize="lg" fontWeight="bold">
                      {title || `General Discussion (${commentCount})`}
                    </Text>
                  </Flex>
                </CardHeader>
                <HSeparator my="16px" />
              </>
            )}
            <CardBody>
              <Flex direction="column" align="center" width={'100%'}>
                {localData && localData.map((comment) => {
                  const isOwner = comment.get('user')?.id === currentUser.id;
                  return (
                    <Flex mb="30px" width={'100%'} position={'relative'}>
                      <Box>
                        <ObjectAvatar
                          object={comment.get('user')}
                          w="50px"
                          h="50px"
                          me="15px"
                          linkTo={(user: User) => `/admin/user/${user.id}`}
                        />
                      </Box>
                      <Flex direction="column">
                        {isOwner && <DeleteButton
                          position={'absolute'}
                          top={0}
                          right={0}
                          object={comment}
                          type='icon'
                        />}
                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                          <NavLink to={`/admin/user/${comment.get('user')?.id}`}>
                            {comment.get('user')?.get('username')}
                          </NavLink>
                        </Text>
                        <Text fontSize="xs" color={'gray.500'}>
                          {moment(comment.get('createdAt')).fromNow()}
                        </Text>
                        <Text
                          color={textColor}
                          fontWeight="normal"
                          fontSize="lg"
                          mt="6px"
                          mb="14px"
                          dangerouslySetInnerHTML={{ __html: comment.get('comment') }}
                        />
                        {/* <Flex>
                      <Flex align="center" color="gray.500" me="21px">
                        <Icon
                          as={AiFillLike}
                          w="18px"
                          h="18px"
                          me="4px"
                          cursor="pointer"
                        />
                        <Text fontSize="md">3 likes</Text>
                      </Flex>
                      <Flex align="center" color="gray.500">
                        <Icon
                          as={IoMdShareAlt}
                          w="18px"
                          h="18px"
                          me="4px"
                          cursor="pointer"
                        />
                        <Text fontSize="md">2 shares</Text>
                      </Flex>
                    </Flex> */}
                      </Flex>
                    </Flex>
                  )
                })}

                <Flex align="flex-start" width={'100%'}>
                  <Box>
                    <ObjectAvatar object={currentUser} w="50px" h="50px" me="15px" />
                  </Box>
                  <Flex align="flex-end" direction="column" width={'100%'}>
                    <EditorInput
                      onChange={onChange}
                      placeholder={'your comment here...'}
                      value={value}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                    />
                    <Button isDisabled={value === ''} onClick={handleCreateComment} mt={2}>
                      Post
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        )
      }}
    </ParseCollectionLiveQuery >
  )
}

export default Discussion;