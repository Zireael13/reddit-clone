import { Box, Heading, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { Layout } from '../../components/Layout'
import { LoadingScreen } from '../../components/LoadingScreen'
import { PostActions } from '../../components/PostActions'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { usePostFromUrl } from '../../utils/usePostFromUrl'

export const Post: React.FC = () => {
  const [{ data, fetching }] = usePostFromUrl()
  console.log(data)

  if (fetching) {
    return <LoadingScreen />
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box mb={5}>
        <Heading mb={5}>{data.post.title}</Heading>
        <Text>{data?.post?.text}</Text>
      </Box>
      <Box>
        <PostActions id={data.post.id} creatorId={data.post.creatorId} />
      </Box>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
