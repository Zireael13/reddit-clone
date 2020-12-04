import React from 'react'
import { Form, Formik } from 'formik'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box, Button } from '@chakra-ui/react'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'

export const Register: React.FC = () => {
  const router = useRouter()
  const [, register] = useRegisterMutation()
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: '', password: '', email: '' }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values)
            const response = await register({ input: values })
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors))
            } else if (response.data?.register.user) {
              router.push('/')
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="username" placeholder="username" label="Username" />
              <Box mt={4}>
                <InputField name="email" placeholder="email" label="Email" />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="red">
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
