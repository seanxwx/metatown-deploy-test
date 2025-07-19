import { Editor } from '@tiptap/core'

const dispatchFormSubmitEvent = ({ editor }: { editor: Editor }): boolean => {
  const { element } = editor.options
  const form = element.closest('form')

  if (!form) {
    return false
  }

  const event = new Event('submit', {
    bubbles: true,
    cancelable: true,
  })

  form.dispatchEvent(event)

  return true
}

export default dispatchFormSubmitEvent
