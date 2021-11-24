import axios from 'axios'
import { useState } from 'react'
import { Alert, LinearProgress, Snackbar, SnackbarOrigin, Slide } from '@mui/material'
import { useQuery } from 'react-query'
import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTable from './RepoTrafficTable'
import { RepoData } from './types'

const RepoTraffic = () => {

  const [showError, setShowError] = useState(false)
  const [errorShown, setErrorShown] = useState(false)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0)

  const queryResult = useQuery<RepoData[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data),
    {
      refetchInterval: autoRefreshInterval * 60 * 1000
    })

  const { isFetching, error, data: rows = [] } = queryResult

  const onCloseError = () => {
    setShowError(false)
  }

  if (error && !errorShown) {
    setShowError(true)
    setErrorShown(true)
  }

  const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
  }

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
        onRefresh={onRefresh}
        onChangeAutoRefreshInterval={onChangeAutoRefreshInterval}
      />
      <LinearProgress sx={{ visibility: isFetching ? 'visible' : 'hidden', mb: '1rem' }} />
      <RepoTrafficTable rows={rows} />

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={onCloseError}
        anchorOrigin={anchorOrigin}
        TransitionComponent={Slide}
      >
        <Alert onClose={onCloseError} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RepoTraffic
