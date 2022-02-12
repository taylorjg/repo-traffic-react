import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Button, Container } from '@mui/material'
import { useToast } from './Toast'
import styled from '@emotion/styled'

const Code = styled.span`
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  color: white;
  background-color: rgba(110, 118, 129, 0.4);
  border-radius: 6px;
`

const Authorize = () => {
  const [clientId, setClientId] = useState('<CLIENT_ID>')
  const { renderToast, showError } = useToast()

  useQuery<{ clientId: string }, Error>(
    'getClientId',
    () => axios.get('/api/clientId').then(({ data }) => data),
    {
      onSuccess: data => setClientId(data.clientId),
      onError: _ => showError('Failed to fetch clientId')
    })

  const href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=public_repo`

  return (
    <Container maxWidth="sm">
      <p>
        <Code>repo-traffic-react</Code> is a GitHub OAuth App. In order to use it,
        you need to authorize it to allow access to your GitHub repos. Click the button
        below to be redirected to GitHub to start the authorization process.
      </p>

      <Button href={href} variant="contained" size="small">Authorize</Button>
      {renderToast()}
    </Container>
  )
}

export default Authorize
