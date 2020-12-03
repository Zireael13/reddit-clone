import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { PostCard } from '../components/PostCard'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return <div>post query failed?</div>
  }

  const updoot = (post, value): void => {
    console.log(post)
    console.log(value)
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
          data.posts.posts.map((post) => <PostCard key={post.id} post={post} />)
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

export default withUrqlClient(createUrqlClient, { ssr: false })(Index)
