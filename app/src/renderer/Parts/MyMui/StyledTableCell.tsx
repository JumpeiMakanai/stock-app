import { styled, TableCell, tableCellClasses } from '@mui/material'

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1E1E3F',
    color: '#ccf',
    padding: 0,
    fontSize: '11px',
    fontWeight: 600,
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: '#eef',
    fontSize: '11px',
    padding: 5,
    fontWeight: 200,
    border: 0,
  },
}))
