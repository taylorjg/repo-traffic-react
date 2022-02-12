import styled from '@emotion/styled'
import { version } from '../package.json'

const StyledVersion = styled.span`
  font-style: italic;
  font-size: smaller;
  position: fixed;
  bottom: .5rem;
  right: .5rem;
`

const Version = () => {
  return (
    <StyledVersion>version: {version}</StyledVersion>
  )
}

export default Version
