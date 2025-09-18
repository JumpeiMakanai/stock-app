import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'

import './index.css'
import { IconButtonNormal, StyledTableCell } from 'renderer/Parts/MyMui'

import { TradeTabledRow } from '../TradeTableRow'
import type { TradeRecord } from 'src/types/TradeType'

export const AddRecordTable = (props: { tradeGroups: TradeRecord[][] }) => {
  return (
    <TableContainer sx={{ height: 'calc(100vh - 112px)' }}>
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
      <TradeTabledRow
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
        {/* add */}
        <StyledTableCell>
          <div style={{ maxHeight: '24px', textAlign: 'center' }}>
            <IconButtonNormal sx={{ padding: 0, marginBottom: '3px' }}>
              <HelpOutlineIcon
                fontSize="small"
                sx={{ color: '#aaf', padding: '2px' }}
              />
            </IconButtonNormal>
          </div>
        </StyledTableCell>
        {/* group */}
        <StyledTableCell></StyledTableCell>
        {[
          '日時',
          'コード',
          '取引',
          '株数',
          '約定単価',
          '手数料',
          '税金',
          '口座',
        ].map((headCell) => (
          <StyledTableCell
            key={headCell}
            align="center"
            padding="none"
            sx={{ color: 'white' }}
          >
            {headCell}
          </StyledTableCell>
        ))}
        {/* delete */}
        <StyledTableCell></StyledTableCell>
      </TableRow>
    </TableHead>
  )
}
