import { Link, TableCell, TableRow, Tooltip } from '@mui/material'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { RepoData } from './types'
import styled from '@emotion/styled'

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

const StyledLanguage = styled.div<{ colour: string }>`
  border: ${props => `2px solid ${props.colour}`};
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
  min-width: 6rem;
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
          <StyledTooltipRow label="Last Commit At:" value={formatDateString(repoData.lastCommitAt)} />
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
        <StyledLanguage colour={repoData.languageColour}>
          {repoData.language}
        </StyledLanguage>
      </TableCell>
      <TableCell>{repoData.views.toLocaleString()}</TableCell>
      <TableCell>{repoData.viewers.toLocaleString()}</TableCell>
      <TableCell>{repoData.clones.toLocaleString()}</TableCell>
      <TableCell>{repoData.cloners.toLocaleString()}</TableCell>
      <TableCell>{repoData.forks.toLocaleString()}</TableCell>
      <TableCell>{repoData.stars.toLocaleString()}</TableCell>
    </TableRow>
  )
}

export default RepoTrafficTableRow
