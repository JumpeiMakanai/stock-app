import { css } from '@emotion/react'
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'

import './index.css'
import { StyledTableCell } from 'renderer/Parts/MyMui'

import { EditTabledRow } from './EditTableRow'

export const EditRecordTable = (props: { tradeGroups: TradeRecord[][] }) => {
  return (
    <TableContainer className={tableStyle.styles}>
      <Table stickyHeader>
        <TradeTableHead />
        <TableBody>
          {props.tradeGroups.map((trades, i) => (
            <TradeGroupComponent
              key={`${trades.length}-${i}`}
              tradeGroup={trades}
              periodIndex={i}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const TradeGroupComponent = React.memo(
  ({
    tradeGroup,
    periodIndex,
  }: {
    tradeGroup: TradeRecord[]
    periodIndex: number
  }) => {
    return tradeGroup.map((trade, index) => (
      <EditTabledRow
        key={`${trade.id}-${index}`}
        trade={trade}
        intervalIndex={index}
        rowBackgroundColor={periodIndex % 2 ? '#222244' : '#2f2f5f'}
      />
    ))
  }
)

const TradeTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        {['日時', '取引', '株数', '約定単価', '手数料', '税金', '口座'].map(
          (headCell) => (
            <StyledTableCell
              key={headCell}
              align="center"
              padding="none"
              sx={{ color: 'white' }}
            >
              {headCell}
            </StyledTableCell>
          )
        )}
        {/* delete */}
        <StyledTableCell></StyledTableCell>
      </TableRow>
    </TableHead>
  )
}

const headerHeight = '50px'
const tableStyle = css`
  height: calc(90% - ${headerHeight});

  @media (min-height: 420px) {
    height: calc(70% - ${headerHeight});
  }
`
