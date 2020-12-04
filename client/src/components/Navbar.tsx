import { Box, Button, Flex, Heading, HStack, Link, Spacer } from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'
import { NextChakraLink } from './NextChakraLink'

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
        <Box>{data.me.username}</Box>
        <Button onClick={() => logout()} isLoading={logoutFetching}>
          Logout
        </Button>
      </>
    )
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="green.500">
      <Flex flex={1} m="auto" maxW={800} align="center">
        <Box ml={8}>
          <NextChakraLink href="/">
            <Heading>Readit</Heading>
          </NextChakraLink>
        </Box>
        <Spacer />
        <NextLink href="/create-post">
          <Button ml="auto" mr={4}>
            Create New Post
          </Button>
        </NextLink>
        <HStack bg="green.200" p={4} spacing={5} justify="end" ml="auto">
          {body}
        </HStack>
      </Flex>
    </Flex>
  )
}
