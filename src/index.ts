import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { Transform } from 'node:stream'
import { parseArgs, styleText } from 'node:util'

const ANSI_COLORS: Parameters<typeof styleText>[0] = [
  'cyan',
  'green',
  'gray',
  'blue',
  'yellow',
]

const colorize = (text: string, index: number) => {
  const color = ANSI_COLORS[index % (ANSI_COLORS.length + 1)]
  return styleText([
    color,
    'dim',
  ], text)
}

const transformOutput = (source: string, index: number) => new Transform({
  transform(chunk, _encoding, callback) {
    const transformedChunk = String(chunk).split('\n')
      .map((line) => `\r${colorize(`${source}|`, index)} ${line}`)
      .join('\n')

    callback(null, transformedChunk)
  },
})

const pipeOutput = (proc: ChildProcessWithoutNullStreams, source: string, index: number) => {
  proc.stdout
    .pipe(transformOutput(source, index))
    .pipe(process.stdout)
  proc.stderr
    .pipe(transformOutput(source, index))
    .pipe(process.stderr)
}

const main = () => {
  const {
    positionals,
    values: { command = 'npm run dev' },
  } = parseArgs({
    allowPositionals: true,
    options: {
      command: {
        type: 'string',
        short: 'c',
      },
    },
  })

  const sources = positionals

  for( const [index, source] of sources.entries() ) {
    const cleanSource = source.replace(/\/$/, '')
    const proc = spawn(command, {
      cwd: source,
      shell: true,
    })

    pipeOutput(proc, cleanSource, index)
  }
}

main()

