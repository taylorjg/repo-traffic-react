import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RepoData } from './types'
import styled from '@emotion/styled'

const StyledTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledTotalLabel = styled.span`
  margin-right: 1rem;
`

const StyledTotalValue = styled.span`
`

type TotalProps = {
  label: string
  value: number
}

const Total: React.FC<TotalProps> = ({ label, value }) => {
  return (
    <StyledTotal>
      <StyledTotalLabel>{label}:</StyledTotalLabel>
      <StyledTotalValue>{value}</StyledTotalValue>
    </StyledTotal>
  )
}

export type RepoTrafficTotalsProps = {
  rows: RepoData[]
}

const sumBy = <T,>(xs: T[], fn: (x: T) => number): number => {
  return xs.reduce((acc: number, x: T) => acc + fn(x), 0)
}

const RepoTrafficTotals: React.FC<RepoTrafficTotalsProps> = ({ rows }) => {

  const totalRepos = rows.length
  const totalViews = sumBy(rows, row => row.viewsCount)
  const totalViewers = sumBy(rows, row => row.viewsUniques)
  const totalClones = sumBy(rows, row => row.clonesCount)
  const totalCloners = sumBy(rows, row => row.clonesUniques)
  const totalForks = sumBy(rows, row => row.forksCount)
  const totalStars = sumBy(rows, row => row.starsCount)

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Totals</Typography>
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
