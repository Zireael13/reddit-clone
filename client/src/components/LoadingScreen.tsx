import { Box } from '@chakra-ui/react'
import React from 'react'
import { Layout } from './Layout'

interface LoadingScreenProps {}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({}) => {
  return (
    <Layout>
      <Box>loading...</Box>
    </Layout>
  )
}
