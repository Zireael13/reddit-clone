import { Box, Button, Flex, HStack, Link } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({})

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
        <Button onClick={() => logout()} isLoading={logoutFetching}>
          Logout
        </Button>
      </>
    )
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="green.500">
      <HStack bg="green.200" p={4} spacing={5} justify="end" ml="auto">
        {body}
      </HStack>
    </Flex>
  )
}
