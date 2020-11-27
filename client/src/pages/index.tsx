import { Box, Button, Heading, VStack, Text, Flex } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React from 'react'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  })
  return (
    <Layout>
      <Flex>
        <Heading>Redditclone</Heading>
        <NextLink href="/create-post">
          <Button ml="auto">Create New Post</Button>
        </NextLink>
      </Flex>
      <br />
      <VStack mt={4} spacing={8} align="strech">
        {data ? (
          data.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))
        ) : (
          <Box>loading...</Box>
        )}
      </VStack>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
