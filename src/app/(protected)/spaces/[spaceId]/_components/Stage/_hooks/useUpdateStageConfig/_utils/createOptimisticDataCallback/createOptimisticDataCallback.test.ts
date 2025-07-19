import { Block, Ground, Indexed, Position } from '@/app/types'
import createOptimisticDataCallback from './createOptimisticDataCallback'

describe('createOptimisticDataCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('returns optimisticData callback function', () => {
    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'entry',
      x: 1,
      y: 2,
      direction: 'N',
    })

    expect(optimisticDataCallback).toBeInstanceOf(Function)
  })

  test('returns null if there is no stageConfigData', () => {
    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'entry',
      x: 1,
      y: 2,
      direction: 'N',
    })

    expect(optimisticDataCallback(undefined)).toBeNull()
  })

  test('returns stageConfigData with updated blocks', () => {
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'blocks',
      ...block,
    })

    const blocks: Block[] = [
      { x: 1, y: 1, direction: 'N', element: 'wall' },
      { x: 1, y: 2, direction: 'N', element: 'wall' },
    ]

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [...blocks, { ...block, createdAt: new Date().toISOString() }],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })
  })

  test('returns stageConfigData with updated entry', () => {
    const position: Position = { x: 2, y: 2, direction: 'N' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'entry',
      ...position,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: position,
      grounds: [],
      zones: null,
    })
  })

  test('returns stageConfigData when delete a block without blocks data', () => {
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'delete',
      ...block,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: null,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: null,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })
  })

  test('returns stageConfigData with updated blocks after delete', () => {
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'delete',
      ...block,
    })

    const blocks: Block[] = [{ x: 1, y: 1, direction: 'N', element: 'wall' }]

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [...blocks, block],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })
  })

  test('returns stageConfigData with updated grounds', () => {
    const ground: Ground = { x: 2, y: 2, direction: 'N', texture: 'grass' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'grounds',
      ...ground,
    })

    const newGrounds: Ground[] = [
      { x: 3, y: 3, direction: 'N', texture: 'grass' },
      { x: 4, y: 4, direction: 'N', texture: 'grass' },
    ]

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: newGrounds,
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [
        ...newGrounds,
        { ...ground, createdAt: new Date().toISOString() },
      ],
      zones: null,
    })
  })

  test('returns stageConfigData with updated grounds when grounds are not provided', () => {
    const ground: Ground = {
      x: 2,
      y: 2,
      direction: 'N',
      texture: 'grass',
    }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'grounds',
      ...ground,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      zones: null,
      grounds: null,
      blocks: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      zones: null,
      grounds: [{ ...ground, createdAt: new Date().toISOString() }],
      blocks: null,
    })
  })

  test('returns stageConfigData with grounds deleted', () => {
    const position: Position = { x: 3, y: 3, direction: 'N' }
    const ground: Ground = { ...position, texture: 'grass' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'delete',
      ...position,
    })

    const updatedStageConfigData = optimisticDataCallback({
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

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })
  })

  test('returns configured block when stage config blocks are not provided', () => {
    const block: Block = { x: 2, y: 2, direction: 'N', element: 'wall' }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'blocks',
      ...block,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      blocks: null,
      zones: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [{ ...block, createdAt: new Date().toISOString() }],
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      zones: null,
    })
  })

  test('returns stageConfigData with updated zones', () => {
    const position: Indexed<Position> = {
      id: 'ZONE_ID',
      x: 2,
      y: 2,
      direction: 'N',
    }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'zone',
      ...position,
    })

    const zones: Indexed<Position>[] = [
      { id: 'ZONE_ID_1', x: 1, y: 1, direction: 'N' },
      { id: 'ZONE_ID_2', x: 1, y: 2, direction: 'N' },
    ]

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      zones,
      entry: { x: 0, y: 0, direction: 'N' },
      grounds: [],
      blocks: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      zones: [...zones, { ...position, createdAt: new Date().toISOString() }],
      grounds: [],
      blocks: null,
    })
  })

  test('returns stageConfigData with updated zones when zones are not provided', () => {
    const position: Indexed<Position> = {
      id: 'ZONE_ID',
      x: 2,
      y: 2,
      direction: 'N',
    }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'zone',
      ...position,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      zones: null,
      grounds: [],
      blocks: null,
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      entry: { x: 0, y: 0, direction: 'N' },
      zones: [{ ...position, createdAt: new Date().toISOString() }],
      grounds: [],
      blocks: null,
    })
  })

  test('returns stageConfigData with zone deleted', () => {
    const position: Indexed<Position> = {
      id: 'ZONE_ID',
      x: 2,
      y: 2,
      direction: 'N',
    }

    const optimisticDataCallback = createOptimisticDataCallback({
      type: 'delete',
      ...position,
    })

    const updatedStageConfigData = optimisticDataCallback({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      zones: [{ id: 'ZONE_ID', x: 2, y: 2, direction: 'N' }],
      grounds: [],
    })

    expect(updatedStageConfigData).toEqual({
      id: 'ID',
      columns: 5,
      rows: 5,
      blocks: [
        { x: 1, y: 1, direction: 'N', element: 'wall' },
        { x: 1, y: 2, direction: 'N', element: 'wall' },
      ],
      entry: { x: 0, y: 0, direction: 'N' },
      zones: [],
      grounds: [],
    })
  })
})
