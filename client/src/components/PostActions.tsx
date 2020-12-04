import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton } from '@chakra-ui/react'
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql'
import { NextChakraLink } from './NextChakraLink'

interface PostActionsProps {
  id: number
  creatorId: number
}

export const PostActions: React.FC<PostActionsProps> = ({ id, creatorId }) => {
  const [, deletePost] = useDeletePostMutation()
  const [{ data: meData }] = useMeQuery()

  if (meData?.me?.id !== creatorId) {
    return null
  }

  return (
    <Box>
      <NextChakraLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton icon={<EditIcon />} aria-label="Edit Post" mr={4}>
          Edit Post
        </IconButton>
      </NextChakraLink>
      <IconButton
        icon={<DeleteIcon />}
        onClick={() => deletePost({ id: id })}
        aria-label="Delete Post"
      >
        Delete Post
      </IconButton>
    </Box>
  )
}
