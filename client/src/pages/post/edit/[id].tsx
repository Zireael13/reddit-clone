import { Box, Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'
import { LoadingScreen } from '../../../components/LoadingScreen'
import { TextareaField } from '../../../components/TextareaField'
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql'
import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetIntId } from '../../../utils/useGetIntId'

interface EditPostProps {}

export const EditPost: React.FC<EditPostProps> = () => {
  const router = useRouter()
  const intId = useGetIntId()
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
  const [, updatePost] = useUpdatePostMutation()

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
    <Layout variant="small">
      <Heading mb={5}>Update Post</Heading>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: intId, ...values })
          router.back()
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <TextareaField name="text" placeholder="text" label="Body" />
            </Box>
            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="red">
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditPost)
