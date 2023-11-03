import {exec} from 'child_process'

export async function execCommand(command: string, isSuccess?: (stdout: string) => boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log('ERROR: ', error)
      }
      if (stderr) {
        // eslint-disable-next-line no-console
        console.error('STDERR CHANNEL: ', stderr)
      }

      if (stdout) {
        // eslint-disable-next-line no-console
        console.info('STDOUT CHANNEL: ', stdout)
        if (!isSuccess) {
          resolve(stdout)
          return
        }

        if (isSuccess(stdout)) {
          resolve(stdout)
        } else {
          reject(new Error(stdout))
        }
      }

      if (error) {
        reject(error)
        process.exit(1)
      }
    })
  })
}
