import { Link, TableCell, TableRow, Tooltip } from '@mui/material'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { RepoData } from './types'
import styled from '@emotion/styled'
import colors from './colors.json'

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

const languageToBorder = (language: string) => {
  const entry = (colors as any)[language]
  return entry && entry.color
    ? `2px solid ${entry.color}`
    : "unset"
}

const StyledLanguage = styled.div<{ language: string }>`
  border: ${props => languageToBorder(props.language)};
  text-align: center;
`

const AlignedIcon = styled.div`
  display: flex;
  align-items: center;
`

const StyledOpenInNew = styled(OpenInNew)`
  margin-left: .25rem;
  font-size: small;
`

const StyledTooltipLabelCell = styled.td`
  font-weight: bold;
  vertical-align: top;
`

const StyledTooltipValueCell = styled.td`
`

type StyledTooltipRowProps = {
  label: string
  value: string
}

const StyledTooltipRow: React.FC<StyledTooltipRowProps> = ({ label, value }) => {
  return (
    <tr>
      <StyledTooltipLabelCell>{label}</StyledTooltipLabelCell>
      <StyledTooltipValueCell>{value}</StyledTooltipValueCell>
    </tr>
  )
}

const formatDateString = (dateString: string) => new Date(dateString).toLocaleDateString()

type RepoTooltipProps = {
  repoData: RepoData
  children: React.ReactElement<any, any>
}

const RepoTooltip: React.FC<RepoTooltipProps> = ({ repoData, children }) => {
  return (
    <Tooltip title={
      <table>
        <tbody>
          <StyledTooltipRow label="Description:" value={repoData.description} />
          <StyledTooltipRow label="Created At:" value={formatDateString(repoData.createdAt)} />
          <StyledTooltipRow label="Updated At:" value={formatDateString(repoData.updatedAt)} />
        </tbody>
      </table>}
      arrow>
        {children}
    </Tooltip>
  )
}

const RepoTrafficTableRow: React.FC<RepoTrafficTableRowProps> = ({ repoData }) => {
  return (
    <TableRow>
      <TableCell>
        <AlignedIcon>
          <RepoTooltip repoData={repoData}>
            <span>{repoData.name}</span>
          </RepoTooltip>
          <Link href={repoData.htmlUrl}>
            <AlignedIcon>
              <StyledOpenInNew />
            </AlignedIcon>
          </Link>
        </AlignedIcon>
      </TableCell>
      <TableCell>
        <StyledLanguage language={repoData.language}>
          {repoData.language}
        </StyledLanguage>
      </TableCell>
      <TableCell>{repoData.viewsCount}</TableCell>
      <TableCell>{repoData.viewsUniques}</TableCell>
      <TableCell>{repoData.clonesCount}</TableCell>
      <TableCell>{repoData.clonesUniques}</TableCell>
      <TableCell>{repoData.forksCount}</TableCell>
      <TableCell>{repoData.starsCount}</TableCell>
    </TableRow>
  )
}

export default RepoTrafficTableRow
