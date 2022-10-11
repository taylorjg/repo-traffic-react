export type UserData = {
  login: string
  name: string
  location: string
}

export type RepoData = {
  id: number
  name: string
  description: string
  language: string
  languageColour: string
  htmlUrl: string
  homepageUrl: string
  createdAt: string
  updatedAt: string
  lastCommitAt: string
  forks: number
  stars: number
  views: number
  viewers: number
  clones: number
  cloners: number
}

export type GitHubData = {
  user: UserData
  repos: [RepoData]
}
