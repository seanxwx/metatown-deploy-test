import { Extension } from '@tiptap/react'
import dispatchFormSubmitEvent from './_utils/dispatchFormSubmitEvent'

const SubmitOnEnter = Extension.create({
  name: 'SubmitOnEnter',
  addKeyboardShortcuts() {
    return {
      Enter: dispatchFormSubmitEvent,
    }
  },
})

export default SubmitOnEnter
