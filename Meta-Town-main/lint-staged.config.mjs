import path from 'path'

const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

const config = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*': ['prettier --check --ignore-unknown'],
}

export default config
