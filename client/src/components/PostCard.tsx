import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, IconButton, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useVoteMutation } from '../generated/graphql'
import { NextChakraLink } from './NextChakraLink'
import { PostActions } from './PostActions'

interface PostCardProps {
  post: any
}

export const PostCard: React.FC<PostCardProps> = (props) => {
  const [, vote] = useVoteMutation()
  const { post } = props

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
          <Box ml="auto">
            <PostActions id={post.id} creatorId={post.creator.id} />
          </Box>
        </Flex>
      </Stack>
    </Flex>
  )
}
