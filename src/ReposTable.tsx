import axios from 'axios'
import { useState } from 'react'
import { Alert, LinearProgress, Snackbar, SnackbarOrigin, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from 'react-query'
import Toolbar from './Toolbar'
import RepoRow from './RepoRow'
import { Item } from './types'

const ReposTable = () => {

  const { isLoading, error, data: items = [] } = useQuery<Item[], Error>(
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

  const filteredItems = items.filter(item => (
    item.views.count > 0 ||
    item.clones.count > 0 ||
    item.repo.forks_count > 0 ||
    item.repo.stargazers_count > 0
  ))

  const anchorOrigin: SnackbarOrigin = {
    horizontal: 'center',
    vertical: 'bottom'
  }

  return (
    <>
      <Toolbar />
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
            {filteredItems.map((item: Item) => <RepoRow key={item.repo.id} item={item} />)}
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

export default ReposTable
