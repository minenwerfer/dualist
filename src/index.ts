import { spawn, type ChildProcessWithoutNullStreams } from 'child_process'
import { Transform } from 'stream'
import { parseArgs } from 'util'

const transformOutput = (source: string) => new Transform({
  transform(chunk, _encoding, callback) {
    const transformedChunk = String(chunk).split('\n')
      .map((line) => line
        ? `[${source}] ${line}`
        : '')
      .join('\n')

    callback(null, transformedChunk)
  },
})

const pipeOutput = (proc: ChildProcessWithoutNullStreams, source: string) => {
  proc.stdout
    .pipe(transformOutput(source))
    .pipe(process.stdout)
  proc.stderr
    .pipe(transformOutput(source))
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

  for( const source of sources ) {
    const proc = spawn('sh', [
      '-c',
      `cd ${source}; ${command}`,
    ])

    pipeOutput(proc, source)
  }
}

main()
