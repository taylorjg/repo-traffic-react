import { TableCell, TableRow } from '@mui/material'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { RepoData } from './types'
import styled from '@emotion/styled'

export type RepoTrafficTableRowProps = {
  repoData: RepoData
}

const AlignedCenter = styled.div`
  display: flex;
  align-items: center;
`

const RepoTrafficTableRow: React.FC<RepoTrafficTableRowProps> = ({ repoData }) => {
  return (
    <TableRow>
      <TableCell>
        <AlignedCenter>
          {repoData.name}
          <a href={repoData.htmlUrl}>
            <AlignedCenter>
              <OpenInNew style={{ marginLeft: '.25rem', fontSize: 'small' }} />
            </AlignedCenter>
          </a>
        </AlignedCenter>
      </TableCell>
      <TableCell>{repoData.language}</TableCell>
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
