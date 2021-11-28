import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const getErrorMessage = (error: Error) => {
  const response = (error as any).response as AxiosResponse
  if (response) {
    const status = response.status
    const statusText = response.statusText
    if (response.data && response.data.message) {
      return `status: ${status}; statusText: ${statusText}; message: ${response.data.message}`
    }
    else {
      return `status: ${status}; statusText: ${statusText}; message: ${error.message}`
    }
  } else {
    return `message: ${error.message}`
  }
}

export const parseLinkHeader = (linkHeader: string) => {
  if (!linkHeader) {
    return []
  }
  return linkHeader
    .split(',')
    .map(link => link.split(';').map(s => s.trim()))
    .map(([hrefPart, relPart]) => {
      const hrefMatch = /^<([^>]+)>$/.exec(hrefPart ?? '')
      const relMatch = /^rel="([^"]+)"$/.exec(relPart ?? '')
      const href = hrefMatch?.[1] ?? ''
      const rel = relMatch?.[1] ?? ''
      return { href, rel }
    })
}

export async function* asyncSplitEvery<T>(xs: AsyncGenerator<T>, n: number): AsyncGenerator<T[]> {
  let chunk: T[] = []
  for await (const x of xs) {
    chunk.push(x)
    if (chunk.length === n) {
      yield chunk
      chunk = []
    }
  }
  if (chunk.length > 0) {
    yield chunk
  }
}

async function* getPagesGen(axiosInstance: AxiosInstance, url: string, config: AxiosRequestConfig): AsyncGenerator<any> {
  console.log('[getPagesGen]', 'url:', url)
  try {
    const response = await axiosInstance.get(url, config)
    const repos = response.data
    yield* repos
    const linkHeader = response.headers['link']
    const links = parseLinkHeader(linkHeader)
    const nextLink = links.find(({ rel }) => rel === 'next')
    if (nextLink) {
      yield* getPagesGen(axiosInstance, nextLink.href, config)
    }
  } catch (error) {
    console.log(getErrorMessage(error as Error))
  }
}

async function* getPageGen(axiosInstance: AxiosInstance, url: string, config: AxiosRequestConfig): AsyncGenerator<any> {
  console.log('[getPageGen]', 'url:', url)
  try {
    const response = await axiosInstance.get(url, config)
    const repos = response.data
    yield* repos
  } catch (error) {
    console.log(getErrorMessage(error as Error))
  }
}

const displayRateLimitData = async (axiosInstance: AxiosInstance, when: string) => {
  const { data } = await axiosInstance.get('/rate_limit')
  const core = data.resources.core
  const { limit, used, remaining } = core
  const reset = new Date(core.reset * 1000).toLocaleString()
  console.log(`[displayRateLimitData (${when})] limit: ${limit}; used: ${used}; remaining: ${remaining}; reset: ${reset}`)
  return data
}

// export const getUserData = async (axiosInstance: AxiosInstance) => {
//   const { data } = await axiosInstance.get('https://api.github.com/user')
//   return data
// }

export const checkToken = async (clientId: string, clientSecret: string, token: string) => {
  try {
    // https://docs.github.com/rest/reference/apps#check-a-token
    const url = `https://api.github.com/applications/${clientId}/token`
    const data = { access_token: token }
    const config = {
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers:
      {
        'Accept': 'application/vnd.github.v3+json',
      }
    }
    const response = await axios.post(url, data, config)
    // console.log('[checkToken]', 'response.data:', response.data)
    return response.data
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = e as Error
      console.log('[checkToken]', 'ERROR:', getErrorMessage(error))
    } else {
      console.log('[checkToken]', 'ERROR:', e)
    }
  }
}

export const getReposImpl = async (clientId: string, clientSecret: string, token: string, repoLimit: number) => {

  const checkTokenData = await checkToken(clientId, clientSecret, token)
  const { login, repos_url } = checkTokenData.user
  console.log('[getReposImpl]', 'login:', login, 'repos_url', repos_url)

  const axiosInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`
    }
  })

  await displayRateLimitData(axiosInstance, 'before')

  const config = {
    params: {
      per_page: repoLimit > 0 ? repoLimit : 100
    }
  }
  const asyncIter = repoLimit > 0
    ? getPageGen(axiosInstance, repos_url, config)
    : getPagesGen(axiosInstance, repos_url, config)

  const CHUNK_SIZE = 25
  const results: any[] = []

  for await (const reposChunk of asyncSplitEvery(asyncIter, CHUNK_SIZE)) {
    try {
      console.log('[getReposImpl]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => axiosInstance.get(`/repos/${repo.owner.login}/${repo.name}/traffic/views`))
      const clonesPromises = reposChunk.map(repo => axiosInstance.get(`/repos/${repo.owner.login}/${repo.name}/traffic/clones`))
      const responses = await Promise.all([...viewsPromises, ...clonesPromises])
      const viewsResponses = responses.slice(0, reposChunk.length)
      const clonesResponses = responses.slice(reposChunk.length)
      reposChunk.forEach((repo: any, index: number) => {
        results.push({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          htmlUrl: repo.html_url,
          language: repo.language,
          starsCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          viewsCount: viewsResponses[index].data.count,
          viewsUniques: viewsResponses[index].data.uniques,
          clonesCount: clonesResponses[index].data.count,
          clonesUniques: clonesResponses[index].data.uniques
        })
      })
    } catch (e: unknown) {
      console.dir(e)
      if (e instanceof Error) {
        const error = e as Error
        console.log('[getReposImpl]', 'ERROR:', getErrorMessage(error))
      } else {
        console.log('[getReposImpl]', 'ERROR:', e)
      }
      break
    }
  }
  await displayRateLimitData(axiosInstance, 'after')
  return results
}
