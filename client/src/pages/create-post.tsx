import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { Layout } from '../components/Layout'
import { TextareaField } from '../components/TextareaField'
import { useCreatePostMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useIsAuth } from '../utils/useIsAuth'

const CreatePost: React.FC = () => {
  const router = useRouter()
  useIsAuth()
  const [, createPost] = useCreatePostMutation()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          const { error, data } = await createPost({ input: values })
          if (!error) {
            router.push('/post/[url]', `/post/${data?.createPost.id}`)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <TextareaField name="text" placeholder="text" label="Body" />
            </Box>
            <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="red">
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
