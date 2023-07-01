import styled from '@emotion/styled'

export const StyledLanguage = styled.div<{ colour: string }>`
  border: ${props => `2px solid ${props.colour}`};
  text-align: center;
`

export const AlignedIcon = styled.div`
  display: flex;
  align-items: center;
`

export const StyledTooltipLabelCell = styled.td`
  font-weight: bold;
  vertical-align: top;
  min-width: 6rem;
`

export const StyledTooltipValueCell = styled.td`
  word-wrap: anywhere;
`

export const StyledLink = styled.a`
  color: inherit;
`

export const StyledTooltipTable = styled.table`
`

export const StyledTooltipRow = styled.tr`
`
