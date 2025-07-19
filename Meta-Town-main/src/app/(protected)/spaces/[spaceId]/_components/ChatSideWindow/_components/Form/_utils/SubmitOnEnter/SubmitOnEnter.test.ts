import { Editor } from '@tiptap/core'
import extensions from '../../../../extensions'
import dispatchFormSubmitEvent from './_utils/dispatchFormSubmitEvent'

vi.mock('./_utils/dispatchFormSubmitEvent')

describe('SubmitOnEnter', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('submits form when Enter is pressed', () => {
    const editor = new Editor({
      element: document.createElement('div'),
      extensions,
    })

    editor.commands.keyboardShortcut('Enter')

    expect(dispatchFormSubmitEvent).toHaveBeenCalledWith({ editor })
  })
})
