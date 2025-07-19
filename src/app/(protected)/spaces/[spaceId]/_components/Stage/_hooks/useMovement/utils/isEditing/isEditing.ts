export const EDITABLE_TAGS = ['input', 'textarea']

const isEditing = (event: KeyboardEvent): boolean => {
  if (!(event.target instanceof HTMLElement)) {
    return false
  }

  const element = event.target

  if (
    EDITABLE_TAGS.includes(element.tagName.toLowerCase()) ||
    element.getAttribute('contenteditable')
  ) {
    return true
  }

  return false
}

export default isEditing
