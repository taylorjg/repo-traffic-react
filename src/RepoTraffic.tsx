import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinearProgress } from '@mui/material'
import { useQuery } from 'react-query'
import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTotals from './RepoTrafficTotals'
import RepoTrafficTable from './RepoTrafficTable'
import { RepoData } from './types'
import { useToast } from './Toast'

const RepoTraffic = () => {

  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0)
  const { renderToast, showError } = useToast()
  const navigate = useNavigate()

  const queryResult = useQuery<RepoData[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data),
    {
      refetchInterval: autoRefreshInterval * 60 * 1000,
      onError: error => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError
          if (axiosError.response?.status === 401) {
            navigate('/authorize')
          }
        }
      }
    })

  const { isFetching, data: rows = [] } = queryResult

  useEffect(
    () => {
      if (queryResult.error) {
        showError(queryResult.error.message)
      }
    },
    // 'showError' is effectively stable because it only calls setState functions which are themselves stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryResult.error]
  )

  const onRefresh = () => {
    if (!queryResult.isFetching) {
      queryResult.refetch()
    }
  }

  const onChangeAutoRefreshInterval = (autoRefreshInterval: number) => {
    setAutoRefreshInterval(autoRefreshInterval)
  }

  return (
    <>
      <RepoTrafficToolbar
        autoRefreshInterval={autoRefreshInterval}
        dataUpdatedAt={queryResult.dataUpdatedAt}
        onRefresh={onRefresh}
        onChangeAutoRefreshInterval={onChangeAutoRefreshInterval}
      />
      <LinearProgress sx={{ visibility: isFetching ? 'visible' : 'hidden', mb: '1rem' }} />
      <RepoTrafficTotals rows={rows} />
      <RepoTrafficTable rows={rows} />

      {renderToast()}
    </>
  )
}

export default RepoTraffic
