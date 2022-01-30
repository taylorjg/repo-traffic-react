import { TextField } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import styled from '@emotion/styled'

const StyledFilter = styled.div`
  display: flex;
  align-items: center;
`

export type RepoTrafficFilterProps = {
  onChange: (value: string) => void
}

const RepoTrafficFilter: React.FC<RepoTrafficFilterProps> = ({ onChange }) => {

  return (
    <StyledFilter>
      <FilterAltIcon />
      <TextField size="small" onChange={(event: any) => onChange(event.target.value)} />
    </StyledFilter>
  )
}

export default RepoTrafficFilter
