import { Box, Button, Flex, HStack, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()

  let body

  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <>
        <Box>Hello {data.me.username}!</Box>
        <Button>Logout</Button>
      </>
    )
  }
  return (
    <Flex bg="green.500">
      <HStack bg="green.200" p={4} spacing={5} justify="end" ml="auto">
        {body}
      </HStack>
    </Flex>
  )
}
