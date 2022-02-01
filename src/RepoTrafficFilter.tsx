import { IconButton, InputAdornment, TextField } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import styled from '@emotion/styled'
import ClearIcon from '@mui/icons-material/Clear'

const StyledFilter = styled.div`
  display: flex;
  align-items: center;
`

export type RepoTrafficFilterProps = {
  value: string
  onChange: (value: string) => void
}

const RepoTrafficFilter: React.FC<RepoTrafficFilterProps> = ({ value, onChange }) => {

  return (
    <StyledFilter>
      <FilterAltIcon />
      <TextField
        size="small"
        value={value}
        onChange={(event: any) => onChange(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')}>
                <ClearIcon opacity={value ? 1 : 0.25} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </StyledFilter>
  )
}

export default RepoTrafficFilter
