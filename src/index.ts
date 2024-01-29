import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import { Transform } from 'stream'
import { parseArgs } from 'util'

const ANSI_COLORS = [
  '\x1b[37m',
  '\x1b[36m',
  '\x1b[35m',
  '\x1b[34m',
  '\x1b[33m',
]

const colorize = (text: string, index: number) => {
  const color = ANSI_COLORS[index % (ANSI_COLORS.length + 1)]
  return `\x1b[2m${color}${text}\x1b[0m`
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
    const proc = spawn('sh', [
      '-c',
      `cd ${source}; ${command}`,
    ])

    pipeOutput(proc, cleanSource, index)
  }
}

main()
