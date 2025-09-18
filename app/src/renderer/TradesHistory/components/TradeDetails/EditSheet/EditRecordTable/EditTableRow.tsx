import DeleteIcon from '@mui/icons-material/Delete'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { TableRow } from '@mui/material'
import { useMemo } from 'react'

import { DateTimeFieldInPieces } from 'renderer/Parts/DateTimeFieldInPieces'
import { PriceInput } from 'renderer/Parts/InputField/PriceInput'
import { StyledInputSelect } from 'renderer/Parts/InputSelect/StyledInputSelect'
import {
  IconButtonCancel,
  IconButtonNormal,
  StyledTableCell,
} from 'renderer/Parts/MyMui'

import {
  useTradeSync,
  useTradeSyncDispatch,
} from 'renderer/TradesHistory/TradeSyncContext'
import type { HoldType, TradeRecord, TradeType } from 'src/types/TradeType'

export const EditTabledRow = ({
  trade,
  intervalIndex,
  rowBackgroundColor,
}: {
  trade: TradeRecord
  intervalIndex: number
  rowBackgroundColor: string
}) => {
  const tradeSync = useTradeSync()
  const dispatch = useTradeSyncDispatch()

  const isDelete = useMemo(
    () => tradeSync.deleteIds.includes(trade.id),
    [tradeSync.deleteIds]
  )

  console.log('edit row', trade)

  return (
    <TableRow
      hover
      sx={{ cursor: 'pointer' }}
      style={{ backgroundColor: rowBackgroundColor }}
    >
      {/**
       * datetime
       * numberで保存することで、sqlとjsでの違いをなくす
       */}
      <StyledTableCell>
        <ShowOnFirstIndex
          text={formatToDateTime(trade.date)}
          index={intervalIndex}
        >
          <DateTimeFieldInPieces
            value={new Date(trade.date)}
            onChange={(date) => {
              dispatch &&
                dispatch({
                  type: 'update',
                  trade: {
                    ...trade,
                    date: date.getTime(),
                  },
                })
            }}
          />
        </ShowOnFirstIndex>
        {isDelete && <StrikeThrough />}
      </StyledTableCell>
      {/** tradetype */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.tradeType} index={intervalIndex}>
          <StyledInputSelect
            value={trade.tradeType}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: {
                  ...trade,
                  tradeType: e.target.value as TradeType,
                },
              })
            }
          >
            {[
              '現物買',
              '現物売',
              '信用新規買',
              '信用新規売',
              '信用返済買',
              '信用返済売',
            ].map((type, i) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </StyledInputSelect>
        </ShowOnFirstIndex>
        {isDelete && <StrikeThrough />}
      </StyledTableCell>
      {/** quantity */}
      <StyledTableCell>
        <PriceInput
          value={trade.quantity}
          style={{ width: '60px' }}
          onChange={(quantity) =>
            dispatch &&
            dispatch({
              type: 'update',
              trade: { ...trade, quantity },
            })
          }
        />
        {isDelete && <StrikeThrough />}
      </StyledTableCell>
      {/** price fee tax */}
      {['price', 'fee', 'tax'].map((field) => (
        <StyledTableCell key={field}>
          <PriceInput
            value={trade[field as keyof TradeRecord] as number}
            style={{ width: '50px' }}
            onChange={(value) => {
              dispatch &&
                dispatch({
                  type: 'update',
                  trade: { ...trade, [field]: value },
                })
            }}
          />
          {isDelete && <StrikeThrough />}
        </StyledTableCell>
      ))}
      {/** holdtype */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.holdType} index={intervalIndex}>
          <StyledInputSelect
            style={{ width: '60px' }}
            value={trade.holdType}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: {
                  ...trade,
                  holdType: e.target.value as HoldType,
                },
              })
            }
          >
            {['一般', '特定', 'NISA'].map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </StyledInputSelect>
        </ShowOnFirstIndex>
        {isDelete && <StrikeThrough />}
      </StyledTableCell>
      <StyledTableCell>
        {isDelete ? (
          <IconButtonNormal
            aria-label="deleteCancel"
            size="small"
            sx={{ color: 'rgb(150,150,220)' }}
            onClick={() => {
              dispatch && dispatch({ type: 'deleteCancel', id: trade.id })
            }}
          >
            <RestoreFromTrashIcon fontSize="inherit" />
          </IconButtonNormal>
        ) : (
          <IconButtonCancel
            aria-label="delete"
            size="small"
            sx={{ color: 'rgb(220,100,100)' }}
            onClick={() =>
              dispatch && dispatch({ type: 'delete', id: trade.id })
            }
          >
            <DeleteIcon fontSize="inherit" />
          </IconButtonCancel>
        )}
      </StyledTableCell>
    </TableRow>
  )
}

const formatToDateTime = (date: Date | number | string) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// コンポーネントをコンポーネント内で定義すると再マウントされて
// inputのフォーカス外れちゃうから気をつけようね！
const ShowOnFirstIndex = ({
  children,
  text,
  index,
}: {
  children: any
  text: string
  index: number
}) => {
  return (
    <div>
      {index == 0 ? (
        children
      ) : (
        <div className="input" style={{ textAlign: 'center' }}>
          {text}
        </div>
      )}
    </div>
  )
}

const StrikeThrough = () => {
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.6)',
        }}
      ></div>
    </div>
  )
}
