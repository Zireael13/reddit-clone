import { Box } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React from 'react'
import { Navbar } from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery()
  return (
    <div>
      <Navbar />
      {data ? (
        data.posts.map((post) => <Box key={post.id}>{post.title}</Box>)
      ) : (
        <Box>loading...</Box>
      )}
    </div>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
