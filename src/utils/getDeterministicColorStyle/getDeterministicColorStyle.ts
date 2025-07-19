import hash from 'hash.js'

const getDeterministicColorStyle = (
  id: string
): {
  backgroundColor: string
  color: string
} => {
  const hex = hash.sha256().update(id).digest('hex')
  const backgroundColor = `#${hex.slice(0, 6)}`

  const r = parseInt(backgroundColor.slice(1, 3), 16)
  const g = parseInt(backgroundColor.slice(3, 5), 16)
  const b = parseInt(backgroundColor.slice(5, 7), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  const color = luminance > 150 ? 'black' : 'white'

  return {
    backgroundColor,
    color,
  }
}

export default getDeterministicColorStyle
