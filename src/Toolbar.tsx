import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

export type ToolbarProps = {
}

const Toolbar: React.FC<ToolbarProps> = () => {
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', mb: '1rem'}}>
      <Button variant="outlined" color="success" endIcon={<RefreshIcon />}>
        Refresh
      </Button>
      <FormControl size="small" sx={{ minWidth: '10rem', ml: '2rem' }}>
        <InputLabel id="auto-refresh-interval-label">Auto Refresh</InputLabel>
        <Select
          labelId="auto-refresh-interval-label"
          id="auto-refresh-interval"
          value={0}
          label="Auto Refresh"
        >
          <MenuItem value={0}>None</MenuItem>
          <MenuItem value={30}>30 Minutes</MenuItem>
          <MenuItem value={60}>1 Hour</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default Toolbar
