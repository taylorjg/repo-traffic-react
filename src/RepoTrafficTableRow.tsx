import { TableCell, TableRow, Tooltip } from '@mui/material'

import { RepoData } from './types'
import {
  StyledLanguage,
  StyledLink,
  StyledTooltipLabelCell,
  StyledTooltipRow,
  StyledTooltipTable,
  StyledTooltipValueCell,
  AlignedIcon
} from "./RepoTrafficTableRow.styles";

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

type StyledTooltipRowProps = {
  label: string
  value: string | React.ReactNode
}

const TooltipRow: React.FunctionComponent<StyledTooltipRowProps> = ({ label, value }) => {
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

const RepoTooltip: React.FunctionComponent<RepoTooltipProps> = ({ repoData, children }) => {
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

const RepoTrafficTableRow: React.FunctionComponent<RepoTrafficTableRowProps> = ({ repoData }) => {
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
