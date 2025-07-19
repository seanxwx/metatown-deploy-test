import { Block, Ground, Position } from '@/app/types'
import upsertStageConfig from '@/db/upsertStageConfig'
import createStageConfigMutatorCallback from './createStageConfigMutatorCallback'

vi.mock('@/db/upsertStageConfig')
const upsertStageConfigMock = vi.mocked(upsertStageConfig)

describe('createStageConfigMutatorCallback', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('returns stageConfigMutator callback function', () => {
    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      'SPACE_ID',
      {
        type: 'entry',
        x: 1,
        y: 2,
        direction: 'N',
      }
    )

    expect(stageConfigMutatorCallback).toBeInstanceOf(Function)
  })

  test('does not call upsert if there is no stageConfigData', () => {
    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      'SPACE_ID',
      {
        type: 'entry',
        x: 1,
        y: 2,
        direction: 'N',
      }
    )

    stageConfigMutatorCallback(undefined)

    expect(upsertStageConfigMock).not.toHaveBeenCalled()
  })

  test('calls upsert with updated blocks', () => {
    const spaceId = 'SPACE_ID'
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'blocks',
        ...block,
      }
    )

    const blocks: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 1, y: 2, direction: 'N', element: 'wall' },
    ]

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: null,
      zones: null,
    })

    expect(upsertStageConfigMock).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks: [...blocks, { ...block, createdAt: expect.any(String) }],
      grounds: null,
      zones: null,
    })
  })

  test('calls upsert when blocks are not provided', () => {
    const spaceId = 'SPACE_ID'
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'blocks',
        ...block,
      }
    )

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks: null,
      zones: null,
      grounds: null,
    })

    expect(upsertStageConfigMock).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks: [{ ...block, createdAt: expect.any(String) }],
      grounds: null,
      zones: null,
    })
  })

  test('calls upsert with updated entry', () => {
    const spaceId = 'SPACE_ID'
    const position: Position = { x: 2, y: 2, direction: 'N' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'entry',
        ...position,
      }
    )

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: null,
      zones: null,
    })

    expect(upsertStageConfigMock).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: position,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      grounds: null,
      zones: null,
    })
  })

  test('calls upsert with deleted blocks', () => {
    const spaceId = 'SPACE_ID'
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'delete',
        ...block,
      }
    )

    const blocks: Block[] = [{ x: 1, y: 1, direction: 'N', element: 'wall' }]

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [...blocks, block],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: null,
      zones: null,
    })

    expect(upsertStageConfigMock).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks,
      grounds: null,
      zones: null,
    })
  })

  test('calls upsert with updated grounds', () => {
    const spaceId = 'SPACE_ID'
    const ground: Ground = { x: 4, y: 4, direction: 'N', texture: 'grass' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'grounds',
        ...ground,
      }
    )

    const grounds: Ground[] = [{ x: 3, y: 3, direction: 'N', texture: 'grass' }]

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds,
      zones: null,
    })

    expect(upsertStageConfigMock).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      grounds: [...grounds, { ...ground, createdAt: expect.any(String) }],
      zones: null,
    })
  })

  test('calls upsert with deleted grounds', () => {
    const spaceId = 'SPACE_ID'
    const position: Position = { x: 4, y: 4, direction: 'N' }
    const ground: Ground = { ...position, texture: 'grass' }

    const stageConfigMutatorCallback = createStageConfigMutatorCallback(
      spaceId,
      {
        type: 'delete',
        ...position,
      }
    )

    stageConfigMutatorCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [ground],
      zones: null,
    })

    expect(upsertStageConfig).toHaveBeenCalledWith({
      spaceId: 'SPACE_ID',
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      zones: null,
      grounds: [],
    })
  })
})
