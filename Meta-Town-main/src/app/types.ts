export type Direction = 'N' | 'E' | 'S' | 'W'

export interface ConfigBlock {
  type: 'blocks'
  element: 'wall'
  direction: Direction
}

export interface ConfigEntry {
  type: 'entry'
}

export interface ConfigDelete {
  type: 'delete'
}

export type ConfigStage = ConfigBlock | ConfigEntry | ConfigDelete

export interface ConfigZone {
  type: 'zone'
  id: string
}

export interface ConfigGroundFloor {
  type: 'grounds'
  texture: 'grass' | 'wood'
}

export interface ConfigGroundDecorator {
  type: 'grounds'
  direction: Direction
  texture: 'chair'
}

export interface Ground extends Position {
  texture: ConfigGroundFloor['texture'] | ConfigGroundDecorator['texture']
}

export type ConfigItem =
  | ConfigStage
  | ConfigZone
  | ConfigGroundFloor
  | ConfigGroundDecorator

export interface Coordinates {
  x: number
  y: number
}

export interface Block extends Position {
  element: ConfigBlock['element']
}

export interface Position extends Coordinates {
  direction: Direction
}

export interface Movement extends Position {
  isMoving: boolean
}

export type ConfigPosition = Position & ConfigItem

export interface Dimensions {
  columns: number
  rows: number
}

export interface CameraOffset {
  left: number
  top: number
}

export interface EmojiReaction {
  emoji: {
    label: string
    unicode: string
  }
  userId: string
  createdAt: string
}

export type Indexed<T> = T & { id: string }
