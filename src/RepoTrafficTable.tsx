import axios from 'axios'
import { useState } from 'react'
import { Alert, LinearProgress, Snackbar, SnackbarOrigin, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from 'react-query'
import RepoTrafficToolbar from './RepoTrafficToolbar'
import RepoTrafficTableRow from './RepoTrafficTableRow'
import { RepoData } from './types'

const RepoTrafficTable = () => {

  const { isLoading, error, data: rows = [] } = useQuery<RepoData[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data))

  const [showError, setShowError] = useState(false)
  const [errorShown, setErrorShown] = useState(false)

  const onCloseError = () => {
    setShowError(false)
  }

  if (error && !errorShown) {
    setShowError(true)
    setErrorShown(true)
  }

  const filteredRows = rows.filter(row => (
    row.views.count > 0 ||
    row.clones.count > 0 ||
    row.repo.forks_count > 0 ||
    row.repo.stargazers_count > 0
  ))

  const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
  }

  return (
    <>
      <RepoTrafficToolbar />
      <LinearProgress sx={{ visibility: isLoading ? 'visible' : 'hidden', mb: '1rem' }} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>views count</TableCell>
              <TableCell>views unique</TableCell>
              <TableCell>clones count</TableCell>
              <TableCell>clones unique</TableCell>
              <TableCell>forks</TableCell>
              <TableCell>stars</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((repoData: RepoData) => <RepoTrafficTableRow key={repoData.repo.id} repoData={repoData} />)}
          </TableBody>
        </Table>
      </TableContainer>
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

export default RepoTrafficTable
