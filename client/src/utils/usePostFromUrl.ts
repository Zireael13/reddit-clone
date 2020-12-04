import { UseQueryResponse } from 'urql'
import { PostQuery, usePostQuery } from '../generated/graphql'
import { useGetIntId } from './useGetIntId'

export const usePostFromUrl = (): UseQueryResponse<PostQuery, object> => {
  const intId = useGetIntId()
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
}
