import * as core from '@actions/core'

export interface Options {
  baseBranch: string
  currentBranch: string
}

export class GitHubOptions implements Options {
  get baseBranch(): string {
    return core.getInput('baseBranch', {
      required: true
    })
  }

  get currentBranch(): string {
    return core.getInput('currentBranch', {required: true})
  }
}
