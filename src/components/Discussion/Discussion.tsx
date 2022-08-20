import Parse from 'parse/dist/parse.min.js';
import moment from 'moment';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  Card,
  CardBody,
  CardHeader,
  ParseCollectionLiveQuery,
  LoadingOverlay,
  DeleteButton,
  EditorInput
} from "@edim/toolkit";

import { ClassNames } from '@app/shared/types'

import { HSeparator } from "../Separator/Separator";
import React, { useState } from "react";

interface DiscussionProps {
  object: Parse.Object<any>;
  isDialog?: boolean
  property: string;
  onCreate?: () => void;
}

export const Discussion = ({ object, property, onCreate, isDialog }: DiscussionProps) => {
  const currentUser = Parse.User.current();
  const [value, setValue] = useState('');
  const textColor = useColorModeValue("gray.700", "white");

  const filters = [
    {
      method: 'equalTo',
      value: object.id,
      prop: 'subjectId',
    },
  ];

  if (property) {
    filters.push({
      method: 'equalTo',
      value: property,
      prop: 'subjectProp',
    });
  }

  const counts = object.get('commentCount') || {};
  const commentCount = (property)
    ? counts[property] || 0
    : counts['count'] || 0;

  return (
    <ParseCollectionLiveQuery
      objectClass={ClassNames.Comment}
      include={['user']}
      filter={filters}
      isLive
    >
      {({ data, isLoading, isError }) => {
        const [isShiftDown, setIsShiftDown] = useState(false);
        const onChange = (value) => {
          setValue(value);
        }

        const handleCreateComment = () => {
          const CommentClass = Parse.Object.extend(ClassNames.Comment);
          const comment = new CommentClass();
          comment.set('comment', value);
          comment.set('subjectId', object.id);
          comment.set('subjectClass', object.className);
          comment.set('subjectProp', property);
          comment.save().then(() => {
            setValue('');
            onCreate();
          });
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
              <><CardHeader>
                <Flex justify="space-between" w="100%">
                  <Text color={textColor} fontSize="lg" fontWeight="bold">
                    {`General Discussion (${commentCount})`}
                  </Text>
                </Flex>
              </CardHeader>
                <HSeparator my="16px" />
              </>)}
            <CardBody>
              <Flex direction="column" align="center" width={'100%'}>
                {data.map((comment) => {
                  const isOwner = comment.get('user')?.id === currentUser.id;
                  return (
                    <Flex mb="30px" width={'100%'} position={'relative'}>
                      <Box>
                        <Avatar w="50px" h="50px" me="15px" />
                      </Box>
                      <Flex direction="column">
                        {isOwner && <DeleteButton
                          position={'absolute'}
                          top={0}
                          right={0}
                          object={comment}
                          type='icon'
                        />}
                        <Text fontSize="md" color={textColor} fontWeight="bold">
                          {comment.get('user')?.get('username')}
                        </Text>
                        <Text fontSize="md" color={textColor}>
                          {moment(comment.get('createdAt')).fromNow()}
                        </Text>
                        <Text
                          color="gray.500"
                          fontWeight="normal"
                          fontSize="md"
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
                    <Avatar src={currentUser.get('avatar')} w="50px" h="50px" me="15px" />
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