import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import DeleteIcon from '@mui/icons-material/Delete'
import { TableRow } from '@mui/material'

import HashStr from 'renderer/InputTrades/hooks/Hash11'
import { useInputTradesDispatch } from 'renderer/InputTrades/InputTradesContext'
import { PriceInput } from 'renderer/Parts/InputField/PriceInput'
import { StyledInputField } from 'renderer/Parts/InputField/StyledInputField'
import { StyledInputSelect } from 'renderer/Parts/InputSelect/StyledInputSelect'
import {
  IconButtonCancel,
  IconButtonNormal,
  StyledTableCell,
} from 'renderer/Parts/MyMui'

import { DateTimeFieldInPieces } from './DateTimeFieldInPieces'
import type { HoldType, TradeRecord, TradeType } from 'src/types/TradeType'

export const TradeTabledRow = ({
  trade,
  intervalIndex,
  rowBackgroundColor,
}: {
  trade: TradeRecord
  intervalIndex: number
  rowBackgroundColor: string
}) => {
  const dispatch = useInputTradesDispatch()

  return (
    <TableRow
      hover
      sx={{ cursor: 'pointer' }}
      style={{ backgroundColor: rowBackgroundColor }}
    >
      <StyledTableCell>
        <IconButtonNormal
          aria-label="copyAdd"
          size="small"
          sx={{
            color: 'rgb(220,220,220)',
          }}
          onClick={() =>
            dispatch &&
            dispatch({
              type: 'push',
              trade: { ...trade, id: HashStr.randCode() },
            })
          }
        >
          <AddToPhotosIcon fontSize="inherit" />
        </IconButtonNormal>
      </StyledTableCell>
      {/* group */}
      <StyledTableCell>
        <ShowOnFirstIndex text={''} index={intervalIndex}>
          <div
            style={{
              width: '18px',
              height: '18px',
              padding: '5px',
              borderRadius: '50%',
              margin: 0,
            }}
            onClick={() =>
              dispatch && dispatch({ type: 'pushInGroup', id: trade.id })
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ccf'
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(220,220,220)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                fontSize: '15px',
                textAlign: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              G
            </div>
          </div>
        </ShowOnFirstIndex>
      </StyledTableCell>
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
      </StyledTableCell>
      {/** symbol */}
      <StyledTableCell>
        <ShowOnFirstIndex text={trade.symbol} index={intervalIndex}>
          <StyledInputField
            value={trade.symbol}
            style={{ width: '50px', textAlign: 'center' }}
            onChange={(e) =>
              dispatch &&
              dispatch({
                type: 'update',
                trade: { ...trade, symbol: e.target.value },
              })
            }
          />
        </ShowOnFirstIndex>
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
      </StyledTableCell>
      <StyledTableCell>
        <IconButtonCancel
          aria-label="delete"
          size="small"
          sx={{ color: 'rgb(220,100,100)' }}
          onClick={() => dispatch && dispatch({ type: 'delete', id: trade.id })}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButtonCancel>
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
