import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'

import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTotals from './RepoTrafficTotals'
import RepoTrafficUser from './RepoTrafficUser'
import RepoTrafficFilter from './RepoTrafficFilter'
import RepoTrafficMinValue from './RepoTrafficMinValue'
import RepoTrafficTable from './RepoTrafficTable'
import { GitHubData, RepoData } from './types'
import { useToast } from './Toast'
import { StyledControlBar, StyledNetworkActivityProgressBar } from "./RepoTraffic.styles";

const RepoTraffic = () => {

  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0)
  const [minValue, setMinValue] = useState(1)
  const [filterString, setFilterString] = useState('')
  const { renderToast, showError } = useToast()
  const navigate = useNavigate()

  const queryResult = useQuery<GitHubData, Error>(
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

  const { isFetching, data } = queryResult

  const rows = data?.repos ?? []
  const userData = data?.user

  const onRefresh = () => {
    if (!queryResult.isFetching) {
      queryResult.refetch()
    }
  }

  const onChangeAutoRefreshInterval = (autoRefreshInterval: number) => {
    setAutoRefreshInterval(autoRefreshInterval)
  }

  const onChangeMinValue = (minValue: number) => {
    setMinValue(minValue)
  }

  const filterPredicate1 = filterString
    ? (row: RepoData) => row.name.toLowerCase().includes(filterString)
    : (_row: RepoData) => true

  const filterPredicate2 = (row: RepoData) => (
    row.views >= minValue ||
    row.viewers >= minValue ||
    row.clones >= minValue ||
    row.cloners >= minValue ||
    row.forks >= minValue ||
    row.stars >= minValue
  )

  const filteredRows = rows
    .filter(filterPredicate1)
    .filter(filterPredicate2)

  return (
    <>
      <RepoTrafficToolbar
        autoRefreshInterval={autoRefreshInterval}
        dataUpdatedAt={queryResult.dataUpdatedAt}
        onRefresh={onRefresh}
        isFetching={isFetching}
        onChangeAutoRefreshInterval={onChangeAutoRefreshInterval}
      />
      <StyledNetworkActivityProgressBar isActive={isFetching} />
      <StyledControlBar>
        <div>
          <RepoTrafficTotals label="Overall Totals" rows={rows} />
          <RepoTrafficTotals label="Filtered Totals" rows={filteredRows} />
          <RepoTrafficUser userData={userData} />
        </div>
        <RepoTrafficMinValue minValue={minValue} onChange={onChangeMinValue} />
        <RepoTrafficFilter value={filterString} onChange={(value: string) => setFilterString(value.toLowerCase())} />
      </StyledControlBar>
      <RepoTrafficTable rows={filteredRows} />
      {renderToast()}
    </>
  )
}

export default RepoTraffic
