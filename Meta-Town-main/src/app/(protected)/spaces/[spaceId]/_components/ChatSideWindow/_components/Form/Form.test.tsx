import { render, screen } from '@testing-library/react'
import { useParams } from 'next/navigation'
import userEvent from '@testing-library/user-event'
import { Editor, useEditor, EditorContent } from '@tiptap/react'
import { vi } from 'vitest'
import { JSONContent } from '@tiptap/core'
import useSessionUser from '@/hooks/useSessionUser'
import useSpace from '@/hooks/useSpace'
import createMessage from '@/db/createMessage'
import Form from './Form'

vi.mock('@/hooks/useSessionUser')
const useSessionUserMock = vi.mocked(useSessionUser)

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/db/createMessage')

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
  EditorContent: vi.fn(),
  Extension: {
    create: vi.fn(),
  },
}))

const useEditorMock = vi.mocked(useEditor)
const EditorContentMock = vi.mocked(EditorContent)

describe('Form', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('renders form', async () => {
    useEditorMock.mockReturnValue({
      isActive: vi.fn(),
      getJSON: (): JSONContent => ({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          },
        ],
      }),
    } as unknown as Editor)

    EditorContentMock.mockImplementation(() => (
      <div
        role="textbox"
        dangerouslySetInnerHTML={{ __html: <p>Hello World</p> }}
      />
    ))

    const spaceId = 'SPACE_ID'

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId,
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    render(<Form />)

    expect(useEditor).toHaveBeenCalled()
    expect(EditorContent).toHaveBeenCalled()
    expect(useSessionUser).toHaveBeenCalled()
    expect(useParams).toHaveBeenCalledWith()
    expect(useSpace).toHaveBeenCalledWith(spaceId)

    expect(
      await screen.findByRole('button', { name: 'Mention someone' })
    ).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Send' })
    ).toBeInTheDocument()
  })

  test('renders nothing if there is no user', () => {
    useSessionUserMock.mockReturnValue({
      data: null,
      isLoading: true,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const { container } = render(<Form />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders nothing if there is no space', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: true,
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    const { container } = render(<Form />)

    expect(container).toBeEmptyDOMElement()
  })

  test('renders nothing if there is no editor', () => {
    useEditorMock.mockReturnValue(null)

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const { container } = render(<Form />)
    expect(container).toBeEmptyDOMElement()
  })

  test('disabled button if user has not typed anything', async () => {
    useEditorMock.mockReturnValue({
      isActive: vi.fn(),
      isEmpty: true,
      getJSON: (): JSONContent => ({}),
    } as unknown as Editor)

    EditorContentMock.mockReturnValue(null)

    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    render(<Form />)

    expect(await screen.findByRole('button', { name: 'Send' })).toBeDisabled()
  })

  test('calls createMessage when send button is clicked', async () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    const editor: Editor = {
      isActive: vi.fn(),
      getJSON: () => ({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          },
        ],
      }),
      commands: {
        setContent: vi.fn(),
      },
    } as unknown as Editor

    useEditorMock.mockReturnValue(editor)

    EditorContentMock.mockImplementation(() => (
      <div dangerouslySetInnerHTML={{ __html: <p>Hello World</p> }} />
    ))

    const user = userEvent.setup()
    render(<Form />)

    await user.click(await screen.findByRole('button', { name: 'Send' }))

    expect(createMessage).toHaveBeenCalledWith({
      senderId: 'ID',
      spaceId: 'SPACE_ID',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          },
        ],
      },
    })

    expect(editor.commands.setContent).toHaveBeenCalledWith('')
  })

  test('does not call createMessage when form is submitted with empty message', () => {
    useSessionUserMock.mockReturnValue({
      data: {
        id: 'ID',
        displayName: 'John Doe',
        avatar: 'dog',
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useSessionUser>)

    useParamsMock.mockReturnValue({
      spaceId: 'SPACE_ID',
    })

    useSpaceMock.mockReturnValue({
      isLoading: false,
      data: { id: 'SPACE_ID', name: 'All-Hands' },
    } as unknown as ReturnType<typeof useSpace>)

    useEditorMock.mockReturnValue({
      isActive: vi.fn(),
      isEmpty: true,
      getJSON: (): JSONContent => ({}),
    } as unknown as Editor)

    EditorContentMock.mockReturnValue(null)

    render(<Form />)

    screen
      .getByRole('form')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    expect(createMessage).not.toHaveBeenCalled()
  })
})
