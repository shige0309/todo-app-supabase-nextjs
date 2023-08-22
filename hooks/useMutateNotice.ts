import { supabase } from '../utils/supabase'
import { Notice, EditedNotice } from '../types/types'
import { useQueryClient, useMutation } from 'react-query'
import useStore from '../store'

export const useMutateNotice = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedNotice)

  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from<Notice>('notices')
        .insert(notice)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData<Notice[]>(
            ['notices'],
            [...previousNotices, res[0]],
          )
        }

        reset()
      },
      onError: (err: Error) => {
        alert(err.message)
        reset()
      },
    },
  )

  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from<Notice>('notices')
        .update({ content: notice.content })
        .eq('id', notice.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData<Notice[]>(
            ['notices'],
            previousNotices.map((notice) =>
              notice.id === variables.id ? res[0] : notice,
            ),
          )
        }
        reset()
      },
      onError: (err: Error) => {
        alert(err.message)
        reset()
      },
    },
  )

  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from<Notice>('notices')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousNotices = queryClient.getQueryData<Notice[]>(['notices'])
        if (previousNotices) {
          queryClient.setQueryData<Notice[]>(
            ['notices'],
            previousNotices.filter((notice) => notice.id !== variables),
          )
        }
        reset()
      },
      onError: (err: Error) => {
        alert(err.message)
        reset()
      },
    },
  )

  return { createNoticeMutation, updateNoticeMutation, deleteNoticeMutation }
}
