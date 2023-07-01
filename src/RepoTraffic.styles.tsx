import styled from '@emotion/styled'
import { LinearProgress } from '@mui/material'

export const StyledControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

// https://github.com/reakit/reakit/issues/466#issuecomment-544344689
export const StyledNetworkActivityProgressBar = styled(({ isActive, ...props }: { isActive: boolean }) => <LinearProgress {...props} />)`
  visibility: ${props => props.isActive ? 'visible' : 'hidden'};
  margin-bottom: 1rem;
`
