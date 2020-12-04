import { Button, Flex, Heading, VStack } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { ReactElement, useState } from 'react'
import { Layout } from '../components/Layout'
import { PostCard } from '../components/PostCard'
import { PostsQueryVariables, usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

type PageProps = {
  variables: PostsQueryVariables
  isLastPage: boolean
  onLoadMore: (cursor: string) => void
}

const Page = ({ variables, isLastPage, onLoadMore }: PageProps): ReactElement => {
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })

  return (
    <>
      <VStack mt={4} spacing={8} align="strech">
        {data?.posts.posts.map((post) => (!post ? null : <PostCard key={post.id} post={post} />))}
      </VStack>
      {(isLastPage && fetching) || (isLastPage && data?.posts.hasMore) ? (
        <Flex>
          <Button
            onClick={() => {
              if (data?.posts) {
                onLoadMore(data.posts.posts[data.posts.posts.length - 1].createdAt)
              }
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </>
  )
}

const limit = 15

const Index: React.FC = () => {
  const [pageVariables, setPageVariables] = useState([{ limit, cursor: null as null | string }])

  return (
    <Layout>
      {pageVariables.map((variables, i) => {
        return (
          <Page
            key={'' + variables.cursor}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(cursor: null | string) =>
              setPageVariables([...pageVariables, { cursor, limit }])
            }
          />
        )
      })}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
