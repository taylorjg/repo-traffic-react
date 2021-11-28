import { Button, Container } from '@mui/material'

const codeStyle: React.CSSProperties = {
  padding: '.2em .4em',
  margin: 0,
  fontSize: '85%',
  color: 'white',
  backgroundColor: 'rgba(110,118,129,0.4)',
  borderRadius: '6px'
}

const clientId = process.env.REACT_APP_CLIENT_ID

const Authorize = () => {
  const href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`
  return (
    <Container maxWidth="sm">
      <p>
        <span style={codeStyle}>repo-traffic-react</span> is a GitHub OAuth App. In order to use it,
        you need to authorize it to allow access to your GitHub repos. Click the button
        below to be redirected to GitHub to start the authorization process.
      </p>

      <Button href={href} variant="contained">Authorize</Button>
    </Container>
  )
}

export default Authorize
