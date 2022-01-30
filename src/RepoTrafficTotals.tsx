import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RepoData } from './types'

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
        <div>Total repos: {totalRepos}</div>
        <div>Total views: {totalViews}</div>
        <div>Total viewers: {totalViewers}</div>
        <div>Total clones: {totalClones}</div>
        <div>Total cloners: {totalCloners}</div>
        <div>Total forks: {totalForks}</div>
        <div>Total stars: {totalStars}</div>
      </AccordionDetails>
    </Accordion>
  )
}

export default RepoTrafficTotals
