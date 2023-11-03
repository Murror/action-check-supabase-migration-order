import {GitHubOptions} from './options'
import {execCommand} from './utils/execCommand'

const extractMigrationTimestamp = (migrationFilePath: string): string => {
  return migrationFilePath?.replace('supabase/migrations/', '').split('_')[0]
}

export const run = async (options: GitHubOptions): Promise<void> => {
  const newMigrationFiles = (await execCommand(`git diff --name-only ${options.baseBranch}..${options.currentBranch} -- supabase/migrations/`))
    .split('\n')
    .filter(file => file)

  if (!newMigrationFiles.length) {
    return
  }

  const existingMigrationFiles = (await execCommand(`git ls-tree --name-only ${options.baseBranch} supabase/migrations/`))
    .split('\n')
    .filter(file => file)

  const newMigrationTimestamps = newMigrationFiles.map(extractMigrationTimestamp)
  const existingMigrationTimestamps = existingMigrationFiles.map(extractMigrationTimestamp)

  const latestMigrationTimestamp = existingMigrationTimestamps.slice(-1)[0]

  const hasConflict = newMigrationTimestamps.some(timestamp => timestamp < latestMigrationTimestamp)

  if (hasConflict) {
    throw new Error('The new migration files in this PR has timestamp conflict.')
  }
}
