import styled from '@emotion/styled'
import { LinearProgress } from '@mui/material'

// https://github.com/reakit/reakit/issues/466#issuecomment-544344689
export const NetworkActivityProgressBar = styled(({ isActive, ...props }: { isActive: boolean }) => <LinearProgress {...props} />)`
  visibility: ${props => props.isActive ? 'visible' : 'hidden'};
  margin-bottom: 1rem;
`
