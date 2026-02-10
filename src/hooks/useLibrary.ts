import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllUserBooks,
  upsertUserBook,
  deleteUserBook,
  clearLibrary,
} from '../storage/libraryStorage'
import type { UserBook } from '../types'

const LIBRARY_QUERY_KEY = ['library'] as const

export function useLibrary() {
  const queryClient = useQueryClient()
  const { data: userBooks = [], isLoading } = useQuery({
    queryKey: LIBRARY_QUERY_KEY,
    queryFn: getAllUserBooks,
  })

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEY })
  }

  function addOrUpdate(userBook: UserBook) {
    upsertUserBook(userBook)
    invalidate()
  }

  function remove(id: string) {
    deleteUserBook(id)
    invalidate()
  }

  function clear() {
    clearLibrary()
    invalidate()
  }

  return { userBooks, isLoading, addOrUpdate, remove, clear }
}
