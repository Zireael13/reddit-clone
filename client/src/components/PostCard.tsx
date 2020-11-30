import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { Flex, VStack, IconButton, Stack, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface PostCardProps {
  post: PostSnippetFragment
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
          onClick={() => vote({ postId: post.id, value: 1 })}
          aria-label="Updoot"
        />
        <Text>{post.points}</Text>
        <IconButton
          icon={<TriangleDownIcon />}
          w={6}
          onClick={() => vote({ postId: post.id, value: -1 })}
          aria-label="Downdoot"
        />
      </VStack>
      <Stack ml={4} direction={['column']} spacing={1}>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text>Posted by: {post.creator.username}</Text>
        <Text>{post.textSnippet}</Text>
      </Stack>
    </Flex>
  )
}
