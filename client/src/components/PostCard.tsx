import { TriangleUpIcon, TriangleDownIcon, DeleteIcon } from '@chakra-ui/icons'
import { Flex, VStack, IconButton, Stack, Heading, Text, Link, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PostSnippetFragment, useDeletePostMutation, useVoteMutation } from '../generated/graphql'
import { NextChakraLink } from './NextChakraLink'
import NextLink from 'next/link'

interface PostCardProps {
  post: any
}

export const PostCard: React.FC<PostCardProps> = (props) => {
  const [, vote] = useVoteMutation()
  const { post } = props

  const [, deletePost] = useDeletePostMutation()

  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <VStack spacing={4}>
        <IconButton
          icon={<TriangleUpIcon />}
          w={6}
          onClick={() => {
            vote({ postId: post.id, value: 1 })
          }}
          aria-label="Updoot"
          colorScheme={post.voteStatus === 1 ? 'red' : 'gray'}
        />
        <Text>{post.points}</Text>
        <IconButton
          icon={<TriangleDownIcon />}
          w={6}
          onClick={() => {
            vote({ postId: post.id, value: -1 })
          }}
          aria-label="Downdoot"
          colorScheme={post.voteStatus === -1 ? 'blue' : 'gray'}
        />
      </VStack>
      <Stack flex={1} ml={4} direction={['column']} spacing={1}>
        <NextChakraLink href="/post/[id]" as={`/post/${post.id}`}>
          <Heading fontSize="xl">{post.title}</Heading>
        </NextChakraLink>
        <Text>Posted by: {post.creator.username}</Text>
        <Flex align="center">
          <Text>{post.textSnippet}</Text>
          <IconButton
            ml="auto"
            icon={<DeleteIcon />}
            onClick={() => deletePost({ id: post.id })}
            colorScheme="red"
            aria-label="Delete Post"
          >
            Delete Post
          </IconButton>
        </Flex>
      </Stack>
    </Flex>
  )
}
