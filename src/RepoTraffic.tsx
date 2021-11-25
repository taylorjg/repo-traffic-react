import axios from 'axios'
import { useEffect, useState } from 'react'
import { LinearProgress } from '@mui/material'
import { useQuery } from 'react-query'
import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTable from './RepoTrafficTable'
import { RepoData } from './types'
import { useToast } from './Toast'

const RepoTraffic = () => {

  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0)
  const { renderToast, showError } = useToast()

  const queryResult = useQuery<RepoData[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data),
    {
      refetchInterval: autoRefreshInterval * 60 * 1000
    })

  const { isFetching, data: rows = [] } = queryResult

  useEffect(
    () => {
      if (queryResult.error) {
        showError(queryResult.error.message)
      }
    },
    // 'showError' is a stable function returned by 'useToast'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryResult.error]
  )

  const onRefresh = () => {
    console.log('[onRefresh]')
    if (!queryResult.isFetching) {
      queryResult.refetch()
    }
  }

  const onChangeAutoRefreshInterval = (autoRefreshInterval: number) => {
    console.log('[onChangeAutoRefreshInterval]', 'autoRefreshInterval:', autoRefreshInterval)
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
      <RepoTrafficTable rows={rows} />

      {renderToast()}
    </>
  )
}

export default RepoTraffic