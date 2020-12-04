import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import gql from 'graphql-tag'
import { PartialNextContext, SSRExchange } from 'next-urql'
import Router from 'next/router'
import { ClientOptions, dedupExchange, Exchange, fetchExchange, stringifyVariables } from 'urql'
import { pipe, tap } from 'wonka'
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
import { invalidatePosts } from './invalidatePosts'
import { isServer } from './isServer'

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // if the operationresult has error send req to sentry
      if (error) {
        if (error?.message.includes('not authenticated')) {
          Router.replace('/login')
        }
      }
    })
  )
}

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info

    const allFields = cache.inspectFields(entityKey)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    )
    info.partial = !isItInTheCache
    let hasMore = true

    const results: string[] = []
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
      const data = cache.resolve(key, 'posts') as string[]
      const _hasMore = cache.resolve(key, 'hasMore')
      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }
      results.push(...data)
    })

    console.log(results)

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    }
  }
}

export const createUrqlClient = (
  ssrExchange: SSRExchange,
  ctx: PartialNextContext | undefined
): ClientOptions => {
  let cookie = ''
  if (isServer()) {
    cookie = ctx?.req.headers.cookie
  }
  console.log()

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: { PaginatedPosts: () => null },
        resolvers: {
          Query: {
            //posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({ __typename: 'Post', id: (args as DeletePostMutationVariables).id })
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              )

              console.log('data: ', data)

              if (data) {
                let newPoints
                let realValue
                console.log(data)
                if (!data.voteStatus) {
                  newPoints = (data.points as number) + value
                  realValue = value
                } else if (data.voteStatus === value) {
                  newPoints = data.points - value
                  realValue = 0
                } else if (data.voteStatus !== value) {
                  newPoints = data.points + value * 2
                  realValue = value
                }
                console.log('value: ', realValue)
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: realValue }
                )
              }
            },
            createPost: (_result, args, cache, info) => {
              invalidatePosts(cache)
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              )

              invalidatePosts(cache)
            },

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return { me: result.login.user }
                  }
                }
              )

              invalidatePosts(cache)
            },
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query
                  } else {
                    return { me: result.register.user }
                  }
                }
              )
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  }
}
