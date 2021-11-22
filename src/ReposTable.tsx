import axios from 'axios'
import { useState } from 'react'
import { Alert, Snackbar, SnackbarCloseReason, SnackbarOrigin, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from 'react-query'
import RepoRow from './RepoRow'
import { Item } from './types'

const ReposTable = () => {

  const { isLoading, error, data: items = [] } = useQuery<Item[], Error>(
    'getRepos',
    () => axios.get('/api/repos').then(({ data }) => data))

  const [showError, setShowError] = useState(false)
  const [errorShown, setErrorShown] = useState(false)

  const onCloseErrorCommon = () => {
    setShowError(false)
  }

  const onCloseError1 = (_event: React.SyntheticEvent<any, Event>, _reason: SnackbarCloseReason) => {
    onCloseErrorCommon()
  }

  const onCloseError2 = (_event: React.SyntheticEvent<Element, Event>) => {
    onCloseErrorCommon()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error && !showError && !errorShown) {
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
        onClose={onCloseError1}
        anchorOrigin={anchorOrigin}
        TransitionComponent={Slide}
      >
        <Alert onClose={onCloseError2} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ReposTable
