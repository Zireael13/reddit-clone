import { usePostQuery } from '../generated/graphql'
import { useGetIntId } from './useGetIntId'

export const usePostFromUrl = () => {
  const intId = useGetIntId()
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
}
