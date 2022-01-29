import { TextField } from '@mui/material'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

export type RepoTrafficFilterProps = {
  onChange: (value: string) => void
}

const RepoTrafficFilter: React.FC<RepoTrafficFilterProps> = ({ onChange }) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FilterAltIcon />
      <TextField size="small" onChange={(event: any) => onChange(event.target.value)} />
    </div>
  )
}

export default RepoTrafficFilter
