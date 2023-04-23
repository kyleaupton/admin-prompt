'use strict'

import { execFile } from 'node:child_process';
import { env } from 'node:process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile)

const SUCCESSFUL_AUTH_MARKER = 'AUTHENTICATION SUCCEEDED'
const EXPECTED_SUCCESSFUL_AUTH_MARKER = `${SUCCESSFUL_AUTH_MARKER}\n`

export const sudo = async (command: string) => {
  try {
    const { stdout, stderr } = await execFileAsync(
      'sudo',
      [ '--askpass', 'sh', '-c', `echo ${SUCCESSFUL_AUTH_MARKER} && ${command}` ],
      {
        encoding: 'utf8',
        env: {
          PATH: env.PATH,
          SUDO_ASKPASS: join('/Users/kyleupton/Documents/GitHub/admin-prompt/src', 'sudo-askpass.osascript.applescript')
        }
      }
    )
    return {
      cancelled: false,
      stdout: stdout.slice(EXPECTED_SUCCESSFUL_AUTH_MARKER.length),
      stderr
    }
  } catch (error) {
    console.error(error)

    throw error
  }
}