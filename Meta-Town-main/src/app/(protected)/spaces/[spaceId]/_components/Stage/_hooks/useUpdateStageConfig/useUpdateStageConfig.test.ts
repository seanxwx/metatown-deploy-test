import { act, renderHook } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { ConfigPosition } from '@/app/types'
import useSpace from '@/hooks/useSpace'
import useStageConfig from '@/hooks/useStageConfig'
import createOptimisticDataCallback from './_utils/createOptimisticDataCallback'
import createStageConfigMutatorCallback from './_utils/createStageConfigMutatorCallback'
import useUpdateStageConfig from './useUpdateStageConfig'

vi.mock('next/navigation')
const useParamsMock = vi.mocked(useParams)

vi.mock('@/hooks/useSpace')
const useSpaceMock = vi.mocked(useSpace)

vi.mock('@/hooks/useStageConfig')
const useStageConfigMock = vi.mocked(useStageConfig)

vi.mock('./_utils/createStageConfigMutatorCallback')

const createStageConfigMutatorCallbackMock = vi.mocked(
  createStageConfigMutatorCallback
)

vi.mock('./_utils/createOptimisticDataCallback')
const createOptimisticDataCallbackMock = vi.mocked(createOptimisticDataCallback)

describe('useUpdateStageConfig', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('calls mutate when mouse is down on stage', async () => {
    const stage = document.createElement('div')
    document.body.appendChild(stage)

    const configPosition: ConfigPosition = {
      type: 'blocks',
      element: 'wall',
      x: 0,
      y: 0,
      direction: 'N',
    }
    const spaceId = 'spaceId'
    const space = { id: spaceId }
    const mutate = vi.fn()

    useParamsMock.mockReturnValue({ spaceId })
    useSpaceMock.mockReturnValue({ data: space } as unknown as ReturnType<
      typeof useSpace
    >)

    useStageConfigMock.mockReturnValue({ mutate } as unknown as ReturnType<
      typeof useStageConfig
    >)

    const stageConfigMutatorCallback = vi.fn()
    createStageConfigMutatorCallbackMock.mockReturnValue(
      stageConfigMutatorCallback
    )

    const optimisticDataCallback = vi.fn()
    createOptimisticDataCallbackMock.mockReturnValue(optimisticDataCallback)

    renderHook(() => useUpdateStageConfig(stage, { configPosition }))

    expect(createOptimisticDataCallback).not.toHaveBeenCalled()
    expect(createStageConfigMutatorCallback).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    await act(() =>
      stage.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    )

    expect(createStageConfigMutatorCallbackMock).toHaveBeenCalledWith(
      spaceId,
      configPosition
    )

    expect(createOptimisticDataCallbackMock).toHaveBeenCalledWith(
      configPosition
    )

    expect(mutate).toHaveBeenCalledWith(stageConfigMutatorCallback, {
      optimisticData: optimisticDataCallback,
      revalidate: false,
      populateCache: false,
    })

    stage.remove()
  })

  test('does not call mutate when mouse is down outside the stage', async () => {
    const stage = document.createElement('div')
    document.body.appendChild(stage)

    const button = document.createElement('button')
    button.textContent = 'OUTSIDE'
    document.body.appendChild(button)

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    const mutate = vi.fn()
    useStageConfigMock.mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useStageConfig>)

    renderHook(() =>
      useUpdateStageConfig(stage, {
        configPosition: {
          type: 'blocks',
          element: 'wall',
          x: 0,
          y: 0,
          direction: 'N',
        },
      })
    )

    await act(() =>
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    )

    expect(createOptimisticDataCallback).not.toHaveBeenCalled()
    expect(createStageConfigMutatorCallback).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    stage.remove()
    button.remove()
  })

  test('does not call mutate when stage is null', async () => {
    const button = document.createElement('button')
    button.textContent = 'OUTSIDE'
    document.body.appendChild(button)

    const mutate = vi.fn()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({ mutate } as unknown as ReturnType<
      typeof useStageConfig
    >)

    const stageConfigMutatorCallback = vi.fn()
    createStageConfigMutatorCallbackMock.mockReturnValue(
      stageConfigMutatorCallback
    )

    const optimisticDataCallback = vi.fn()
    createOptimisticDataCallbackMock.mockReturnValue(optimisticDataCallback)

    renderHook(() =>
      useUpdateStageConfig(null, {
        configPosition: {
          type: 'blocks',
          element: 'wall',
          x: 0,
          y: 0,
          direction: 'N',
        },
      })
    )

    await act(() =>
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    )

    expect(createOptimisticDataCallback).not.toHaveBeenCalled()
    expect(createStageConfigMutatorCallback).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    button.remove()
  })

  test('does not call mutate when configPosition is null', async () => {
    const stage = document.createElement('div')
    document.body.appendChild(stage)

    const mutate = vi.fn()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: { id: 'SPACE_ID' },
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({ mutate } as unknown as ReturnType<
      typeof useStageConfig
    >)

    const stageConfigMutatorCallback = vi.fn()
    createStageConfigMutatorCallbackMock.mockReturnValue(
      stageConfigMutatorCallback
    )

    const optimisticDataCallback = vi.fn()
    createOptimisticDataCallbackMock.mockReturnValue(optimisticDataCallback)

    renderHook(() => useUpdateStageConfig(stage, { configPosition: null }))

    await act(() =>
      stage.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    )

    expect(createOptimisticDataCallback).not.toHaveBeenCalled()
    expect(createStageConfigMutatorCallback).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    stage.remove()
  })

  test('does not call mutate when space is null', async () => {
    const stage = document.createElement('div')
    document.body.appendChild(stage)

    const mutate = vi.fn()

    useParamsMock.mockReturnValue({ spaceId: 'SPACE_ID' })

    useSpaceMock.mockReturnValue({
      data: null,
    } as unknown as ReturnType<typeof useSpace>)

    useStageConfigMock.mockReturnValue({ mutate } as unknown as ReturnType<
      typeof useStageConfig
    >)

    const stageConfigMutatorCallback = vi.fn()
    createStageConfigMutatorCallbackMock.mockReturnValue(
      stageConfigMutatorCallback
    )

    const optimisticDataCallback = vi.fn()
    createOptimisticDataCallbackMock.mockReturnValue(optimisticDataCallback)

    renderHook(() =>
      useUpdateStageConfig(stage, {
        configPosition: {
          type: 'blocks',
          element: 'wall',
          x: 0,
          y: 0,
          direction: 'N',
        },
      })
    )

    await act(() =>
      stage.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    )

    expect(createOptimisticDataCallback).not.toHaveBeenCalled()
    expect(createStageConfigMutatorCallback).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    stage.remove()
  })
})
