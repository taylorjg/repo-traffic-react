import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export type RepoTrafficToolbarProps = {
  autoRefreshInterval: number,
  onRefresh: () => void,
  onChangeAutoRefreshInterval: (autoRefreshInterval: number) => void
}

const RepoTrafficToolbar: React.FC<RepoTrafficToolbarProps> = ({
  autoRefreshInterval,
  onRefresh,
  onChangeAutoRefreshInterval
}) => {

  const handleClickRefresh = () => {
    onRefresh()
  }

  const handleChangeAutoRefreshInterval = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number
    onChangeAutoRefreshInterval(value)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
      <Button variant="outlined" color="success" endIcon={<RefreshIcon />} onClick={handleClickRefresh}>
        Refresh
      </Button>
      <FormControl size="small" sx={{ minWidth: '10rem', ml: '2rem' }}>
        <InputLabel id="auto-refresh-interval-label">Auto Refresh</InputLabel>
        <Select
          labelId="auto-refresh-interval-label"
          id="auto-refresh-interval"
          value={autoRefreshInterval}
          label="Auto Refresh"
          onChange={handleChangeAutoRefreshInterval}
        >
          <MenuItem value={0}>Off</MenuItem>
          <MenuItem value={15}>15 Minutes</MenuItem>
          <MenuItem value={30}>30 Minutes</MenuItem>
          <MenuItem value={60}>1 Hour</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default RepoTrafficToolbar
