import EditNoteIcon from '@mui/icons-material/EditNote'
import { Tooltip } from '@mui/material'
import { useState } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'
import { IconButtonNormal } from 'renderer/Parts/MyMui'
import { useFocusedTrades } from 'renderer/TradesHistory/FocusedTradesContext'
import { formatToDateTime } from 'renderer/TradesHistory/hooks/formatToTime'

import { EditSheet } from './EditSheet'

export const TradeDetails = () => {
  const focusedTrades = useFocusedTrades()
  const [showEditTable, setShowEditTable] = useState(false)

  return (
    <>
      <div style={{ height: '34px', textAlign: 'right' }}>
        <Tooltip title={'編集'}>
          <IconButtonNormal
            size="small"
            style={{ margin: '3px 15px 3px auto' }}
            onClick={() => setShowEditTable(!showEditTable)}
          >
            <EditNoteIcon style={{ color: '#ccf' }} fontSize="inherit" />
          </IconButtonNormal>
        </Tooltip>
        {showEditTable && (
          <EditSheet
            trades={focusedTrades.selectedTrades || []}
            toggleShow={() => {
              setShowEditTable(!showEditTable)
            }}
          />
        )}
      </div>
      <div className="trade-details">
        <table>
          <thead>
            <tr>
              <th scope="col">時間</th>
              <th scope="col" colSpan={2}>
                銘柄
              </th>
              <th scope="col">取引</th>
              <th scope="col">株数</th>
              <th scope="col">約定単価</th>
              <th scope="col" colSpan={2}>
                市場
              </th>
              <th scope="col">手数料</th>
              <th scope="col">税金</th>
            </tr>
          </thead>
          <tbody>
            {focusedTrades.selectedTrades &&
              focusedTrades.selectedTrades.map((trade) => (
                <tr key={trade.id}>
                  <td scope="row" align="center">
                    {formatToDateTime(trade.date)}
                  </td>
                  <td style={{ fontWeight: 600, textAlign: 'right' }}>
                    {trade.symbol}
                  </td>
                  <td align="center">{trade.company}</td>
                  <td align="center">{trade.tradeType}</td>
                  <td align="right">{priceFormatter(trade.quantity)}株</td>
                  <td align="right">{priceFormatter(trade.price)}円</td>
                  <td align="right">{trade.place}</td>
                  <td align="center">{trade.market}</td>
                  <td align="right">{priceFormatter(trade.fee)}円</td>
                  <td align="right">{priceFormatter(trade.tax)}円</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
