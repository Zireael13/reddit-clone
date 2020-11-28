import { Box, Button, Heading, VStack, Text, Flex } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [variables, setVariables] = useState({ limit: 33, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return <div>post query failed?</div>
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Redditclone</Heading>
        <NextLink href="/create-post">
          <Button ml="auto">Create New Post</Button>
        </NextLink>
      </Flex>
      <br />
      <VStack mt={4} spacing={8} align="strech">
        {data && !fetching ? (
          data.posts.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))
        ) : (
          <Box>loading...</Box>
        )}
      </VStack>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
