import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RepoData } from './types'
import styled from '@emotion/styled'

const StyledTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`

const StyledTotalLabel = styled.span``
const StyledTotalValue = styled.span``

type TotalProps = {
  label: string
  value: number
}

const Total: React.FC<TotalProps> = ({ label, value }) => {
  return (
    <StyledTotal>
      <StyledTotalLabel>{label}:</StyledTotalLabel>
      <StyledTotalValue>{value.toLocaleString()}</StyledTotalValue>
    </StyledTotal>
  )
}

export type RepoTrafficTotalsProps = {
  label: string
  rows: RepoData[]
}

const sumBy = <T,>(xs: T[], fn: (x: T) => number): number => {
  return xs.reduce((acc: number, x: T) => acc + fn(x), 0)
}

const RepoTrafficTotals: React.FC<RepoTrafficTotalsProps> = ({ label, rows }) => {

  const totalRepos = rows.length
  const totalViews = sumBy(rows, row => row.views)
  const totalViewers = sumBy(rows, row => row.viewers)
  const totalClones = sumBy(rows, row => row.clones)
  const totalCloners = sumBy(rows, row => row.cloners)
  const totalForks = sumBy(rows, row => row.forks)
  const totalStars = sumBy(rows, row => row.stars)

  const onChange = (_event: React.SyntheticEvent, expanded: boolean) => {
    gtag('event', expanded ? 'open_totals' : 'close_totals', { label })
  }

  return (
    <Accordion onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Total label="Total repos" value={totalRepos} />
        <Total label="Total views" value={totalViews} />
        <Total label="Total viewers" value={totalViewers} />
        <Total label="Total clones" value={totalClones} />
        <Total label="Total cloners" value={totalCloners} />
        <Total label="Total forks" value={totalForks} />
        <Total label="Total stars" value={totalStars} />
      </AccordionDetails>
    </Accordion>
  )
}

export default RepoTrafficTotals
