import React from 'react'
import { Form, Formik } from 'formik'
import { Input } from '@chakra-ui/input'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react'
import { Wrapper } from '../components/Wrapper'

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        {({ values, handleChange }) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">First name</FormLabel>
              <Input
                id="username"
                value={values.username}
                onChange={handleChange}
                placeholder="username"
              />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register
