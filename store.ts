import create from 'zustand'
import { EditedTask, EditedNotice } from './types/types'

type State = {
  editedTask: EditedTask
  editedNotice: EditedNotice
  updateEditedTask: (payLoad: EditedTask) => void
  resetEditedTask: () => void
  updateEditedNotice: (payLoad: EditedNotice) => void
  resetEditedNotice: () => void
}

const useStore = create<State>((set) => ({
  editedTask: { id: '', title: '' },
  editedNotice: { id: '', content: '' },
  updateEditedTask: (payLoad) => set({ editedTask: payLoad }),
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),
  updateEditedNotice: (payLoad) => set({ editedNotice: payLoad }),
  resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}))

export default useStore
