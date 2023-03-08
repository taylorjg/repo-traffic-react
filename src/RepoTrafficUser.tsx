import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { UserData } from './types'
import styled from '@emotion/styled'

const StyledUserRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`

const StyledUserRowLabel = styled.span``
const StyledUserRowValue = styled.span``

type UserRowProps = {
  label: string
  value?: string | number
}

const UserRow: React.FC<UserRowProps> = ({ label, value = '' }) => {
  return (
    <StyledUserRow>
      <StyledUserRowLabel>{label}:</StyledUserRowLabel>
      <StyledUserRowValue>{value}</StyledUserRowValue>
    </StyledUserRow>
  )
}

export type RepoTrafficUserProps = {
  userData?: UserData
}

const RepoTrafficUser: React.FC<RepoTrafficUserProps> = ({ userData }) => {

  const onChange = (_event: React.SyntheticEvent, expanded: boolean) => {
    gtag('event', expanded ? 'open_user' : 'close_user')
  }

  return (
    <Accordion onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>User</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <UserRow label="Login" value={userData?.login} />
        <UserRow label="Name" value={userData?.name} />
        <UserRow label="Location" value={userData?.location} />
        <UserRow label="Followers" value={userData?.followers.totalCount} />
      </AccordionDetails>
    </Accordion>
  )
}

export default RepoTrafficUser
