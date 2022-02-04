import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

export type RepoTrafficMinValueProps = {
  minValue: number
  onChange: (minValue: number) => void
}

const MIN_VALUES = [1, 10, 100, 1_000, 10_000]

const RepoTrafficMinValue: React.FC<RepoTrafficMinValueProps> = ({ minValue, onChange }) => {

  const handleChangeMinValue = (event: SelectChangeEvent<number>) => {
    const minValue = event.target.value as number
    gtag('event', 'change_min_value', { minValue })
    onChange(minValue)
  }

  return (
    <FormControl size="small" sx={{ minWidth: '8rem' }}>
      <InputLabel id="min-value-label">Min Value</InputLabel>
      <Select
        labelId="min-value-label"
        label="Min Value"
        value={minValue}
        onChange={handleChangeMinValue}
      >
        {
          MIN_VALUES.map(minValue => (
            <MenuItem key={minValue} value={minValue}>
              {Number(minValue).toLocaleString()}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default RepoTrafficMinValue
