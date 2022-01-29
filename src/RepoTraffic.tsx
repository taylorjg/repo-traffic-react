import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinearProgress } from '@mui/material'
import { useQuery } from 'react-query'
import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTotals from './RepoTrafficTotals'
import RepoTrafficFilter from './RepoTrafficFilter'
import RepoTrafficTable from './RepoTrafficTable'
import { RepoData } from './types'
import { useToast } from './Toast'

const RepoTraffic = () => {

  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0)
  const [filterString, setFilterString] = useState('')
  const { renderToast, showError } = useToast()
  const navigate = useNavigate()

  const queryResult = useQuery<RepoData[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data),
    {
      refetchInterval: autoRefreshInterval * 60 * 1000,
      onError: error => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate('/authorize')
            return
          }
        }
        showError(error.message)
      }
    })

  const { isFetching, data: rows = [] } = queryResult

  const onRefresh = () => {
    if (!queryResult.isFetching) {
      queryResult.refetch()
    }
  }

  const onChangeAutoRefreshInterval = (autoRefreshInterval: number) => {
    setAutoRefreshInterval(autoRefreshInterval)
  }

  const filteredRows = filterString
    ? rows.filter(row => row.name.toLowerCase().includes(filterString))
    : rows

  return (
    <>
      <RepoTrafficToolbar
        autoRefreshInterval={autoRefreshInterval}
        dataUpdatedAt={queryResult.dataUpdatedAt}
        onRefresh={onRefresh}
        isFetching={isFetching}
        onChangeAutoRefreshInterval={onChangeAutoRefreshInterval}
      />
      <LinearProgress sx={{ visibility: isFetching ? 'visible' : 'hidden', mb: '1rem' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RepoTrafficTotals rows={rows} />
        <RepoTrafficFilter onChange={(value: string) => setFilterString(value.toLowerCase())} />
      </div>
      <RepoTrafficTable rows={filteredRows} />
      {renderToast()}
    </>
  )
}

export default RepoTraffic
