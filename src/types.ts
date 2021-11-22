export type Item = {
  repo: {
    id: number,
    name: string,
    description: string,
    language: string,
    htmlUrl: string,
    forks_count: number,
    stargazers_count: number,
    createdAt: string,
    updatedAt: string
  },
  clones: {
    count: number,
    uniques: number
  },
  views: {
    count: number,
    uniques: number
  }
}
