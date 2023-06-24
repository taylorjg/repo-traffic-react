import { TableCell, TableRow, Tooltip } from '@mui/material'
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

const StyledTooltipLabelCell = styled.td`
  font-weight: bold;
  vertical-align: top;
  min-width: 6rem;
`

const StyledTooltipValueCell = styled.td`
  word-wrap: anywhere;
`

const StyledLink = styled.a`
  color: inherit;
`

type StyledTooltipRowProps = {
  label: string
  value: string | React.ReactNode
}

const StyledTooltipTable = styled.table`
`

const StyledTooltipRow = styled.tr`
`

const TooltipRow: React.FC<StyledTooltipRowProps> = ({ label, value }) => {
  return (
    <StyledTooltipRow>
      <StyledTooltipLabelCell>{label}</StyledTooltipLabelCell>
      <StyledTooltipValueCell>{value}</StyledTooltipValueCell>
    </StyledTooltipRow>
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
      <StyledTooltipTable>
        <tbody>
          <TooltipRow label="Description:" value={repoData.description} />
          <TooltipRow label="Created At:" value={formatDateString(repoData.createdAt)} />
          <TooltipRow label="Updated At:" value={formatDateString(repoData.updatedAt)} />
          <TooltipRow label="Last Commit At:" value={formatDateString(repoData.lastCommitAt)} />
          <TooltipRow label="GitHub:" value={<StyledLink href={repoData.htmlUrl}>{repoData.htmlUrl}</StyledLink>} />
          {repoData.homepageUrl && (
            <TooltipRow label="Website:" value={<StyledLink href={repoData.homepageUrl}>{repoData.homepageUrl}</StyledLink>} />
          )}
        </tbody>
      </StyledTooltipTable>}
      arrow
    >
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
          {/* <Link href={repoData.htmlUrl}>
            <AlignedIcon>
              <StyledGitHubIcon />
            </AlignedIcon>
          </Link> */}
        </AlignedIcon>
      </TableCell>
      <TableCell>
        <StyledLanguage colour={repoData.languageColour ?? "transparent"}>
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
