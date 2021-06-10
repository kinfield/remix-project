import * as WS from 'ws' // eslint-disable-line
import { writeFileSync, readFileSync} from 'fs'
import { PluginClient } from '@remixproject/plugin'
import { absolutePath } from '../utils'
const { spawn, spawnSync, execSync } = require('child_process')

export class SlitherClient extends PluginClient {
  methods: Array<string>
  websocket: WS
  currentSharedFolder: string

  constructor (private readOnly = false) {
    super()
    this.methods = ['analyse']
  }

  setWebSocket (websocket: WS): void {
    this.websocket = websocket
  }

  sharedFolder (currentSharedFolder: string): void {
    this.currentSharedFolder = currentSharedFolder
  }

  // transform (slitherResults) {
    // Analysis Description
// Analysis Short title
// Confidence
// Severity
// Source Map
// Module Category
// Reference link
// Example code snippets
// Other data
  // }

  analyse (ast: string) {
    console.log('ast received----->', ast)
    return new Promise((resolve, reject) => {
      if (this.readOnly) {
        const errMsg = '[Slither Analysis]: Cannot analyse in read-only mode'
        return reject(new Error(errMsg))
      }
      const result = spawnSync('ls', { cwd: this.currentSharedFolder })
      const dirContent = result.stdout.toString()
      if(!dirContent.includes('temp_remix')) execSync('mkdir temp_remix', { cwd: this.currentSharedFolder })
      const astFilePath = absolutePath('./', this.currentSharedFolder) + '/temp_remix/' + 'ast.json'
      writeFileSync(astFilePath, JSON.stringify(ast, null, '\t'))
      // const outputFile = 'temp_remix/slitherReport_' + Date.now() + '.json' 
      // const cmd = `slither --solc-ast ${astFilePath} --json ${outputFile}`
      // const options = { cwd: this.currentSharedFolder, shell: true }
      // const child = spawn(cmd, options)
      // let result = ''
      // let error = ''
      // child.stdout.on('data', (data) => {
      //   const msg = `[Slither Analysis]: ${data.toString()}`
      //   console.log('\x1b[32m%s\x1b[0m', msg)
      //   result += msg + '\n'
      // })
      // child.stderr.on('data', (err) => {
      //   error += `[Slither Analysis]: ${err.toString()}`
      // })
      // child.on('close', () => {
      //   if (error) reject(error)
      //   else resolve(result)
      // })
    })
  }
}
