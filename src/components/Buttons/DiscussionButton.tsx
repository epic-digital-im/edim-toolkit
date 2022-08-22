import React, { useState } from 'react';
import { Flex, Text, Button, IconButton, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { BiCommentDetail } from "react-icons/bi";
import DiscussionDialog from '../Dialogs/DiscussionDialog';

interface DiscussionDialogButtonProps {
  object: Parse.Object<any>;
  context?: string;
  onDiscussionDialog?: () => void;
  label?: string;
  refetch?: () => void;
  type?: 'button' | 'icon';
}

export const DiscussionDialogButton: React.FC<DiscussionDialogButtonProps> = ({ object, context, onDiscussionDialog, label, refetch, type, ...rest }) => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDiscussionDialog = (refetchCount) => async () => {
    setIsDeleting(true);
    try {
      await object.destroy();
      toast({
        title: 'Success',
        description: `${object.className} deleted successfully`,
        status: 'success',
        duration: 5000,
      })
      if (onDiscussionDialog) onDiscussionDialog();
      if (refetch) refetch();
      if (refetchCount) refetchCount();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error deleting object: ' + err?.message,
        status: 'error',
        duration: 5000,
      })
    }
    setIsDeleting(false);
  }

  const handleClose = (refetchCount) => () => {
    if (refetchCount) refetchCount();
    onClose();
  }

  const counts = object.get('commentCount') || {};
  const commentCount = (context)
    ? counts[context] || 0
    : counts['count'] || 0;
  const hasComments = commentCount > 0;

  return (
    <>
      {(type === 'icon') ? (
        <Flex {...rest} alignItems={'center'}>
          <IconButton
            color={hasComments ? 'green.500' : 'gray.500'}
            aria-label={label || "DiscussionDialog"}
            icon={<Icon as={BiCommentDetail} me="4px" />}
            onClick={onOpen}
            isDisabled={isDeleting}
            isLoading={isDeleting}
            ml={2}
            mr={2} />
          {hasComments && <Text fontSize="sm" fontWeight="semibold" color={hasComments ? 'green.500' : null}>
            {commentCount}
          </Text>}
        </Flex>
      ) : (
        <Button variant={'outline'} p="0px" bg="transparent" onClick={onOpen} ml={2} mb={2} {...rest}>
          <Flex cursor="pointer" align="center" p="12px">
            <Icon as={BiCommentDetail} me="4px" />
            <Text fontSize="sm" fontWeight="semibold">
              {hasComments ? `${commentCount} Comment(s) ` : ''}
            </Text>
          </Flex>
        </Button>
      )}
      <DiscussionDialog
        object={object}
        context={context}
        isOpen={isOpen}
        onClose={handleClose(refetch)}
        onConfirm={handleDiscussionDialog(refetch)}
      />
    </>
  )
}

export default DiscussionDialogButton;