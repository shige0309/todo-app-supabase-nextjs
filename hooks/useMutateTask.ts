import { useQueryClient, useMutation } from 'react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import { Task, EditedTask } from '../types/types'
import { on } from 'events'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const reset = useStore((state) => state.resetEditedTask)

  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from<Task>('todos').insert(task)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['todos'],
            [...previousTodos, res[0]],
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

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from<Task>('todos')
        .update({ title: task.title })
        .eq('id', task.id)
      if (error) throw new Error(error.message)
      return data
    },
    //variablesは今更新したtaskのid
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['todos'],
            previousTodos.map((task) =>
              task.id === variables.id ? res[0] : task,
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

  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from<Task>('todos')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            ['todos'],
            previousTodos.filter((task) => task.id !== variables),
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
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
