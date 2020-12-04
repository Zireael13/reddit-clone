import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import React, { useState } from 'react'
import { InputField } from '../components/InputField'
import { Layout } from '../components/Layout'
import { Wrapper } from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const ForgotPassword: React.FC = () => {
  const [, forgotPassword] = useForgotPasswordMutation()
  const [emailSent, setEmailSent] = useState(false)
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            console.log(values)
            const response = await forgotPassword({ email: values.email })
            if (response.data?.forgotPassword) {
              setEmailSent(true)
            }
          }}
        >
          {({ isSubmitting }) =>
            emailSent ? (
              <Box>If account with that email exists, reset password email has been sent</Box>
            ) : (
              <Form>
                <InputField name="email" placeholder="email" label="Email" />
                <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="red">
                  Reset Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
