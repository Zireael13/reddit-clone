import { Box, Heading, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { Layout } from '../../components/Layout'
import { usePostQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

interface PostProps {}

export const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter()
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })

  console.log(data)

  if (fetching) {
    return (
      <Layout>
        <Box>loading...</Box>
      </Layout>
    )
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
      <Box>
        <Heading mb={5}>{data.post.title}</Heading>
        <Text>{data?.post?.text}</Text>
      </Box>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
