import { createContext, useContext, useReducer, type Dispatch } from 'react'

import HashStr from './hooks/Hash11'
import type { TradeRecord } from 'src/types/TradeType';

type InputTradesAction =
  | { type: 'push'; trade: TradeRecord }
  | { type: 'pushInGroup'; id: string }
  | { type: 'add' }
  | { type: 'delete'; id: string }
  | { type: 'update'; trade: TradeRecord }
  | { type: 'reset' }

const initializeTrade = (): TradeRecord => {
  return {
    id: HashStr.randCode(),
    date: new Date().getTime(),
    symbol: '',
    tradeType: '現物買',
    holdType: '一般',
    quantity: 0,
    price: 0,
    fee: 0,
    tax: 0,
  }
}

const InputTradesContext = createContext<TradeRecord[][]>([])
const InputTradesDispachContext =
  createContext<Dispatch<InputTradesAction> | null>(null)

export function InputTradesProvider({ children }: { children: any }) {
  const [inputTrades, dispach] = useReducer(InputTradesReducer, [
    [initializeTrade()],
  ])

  return (
    <div>
      <InputTradesContext.Provider value={inputTrades}>
        <InputTradesDispachContext.Provider value={dispach}>
          {children}
        </InputTradesDispachContext.Provider>
      </InputTradesContext.Provider>
    </div>
  )
}

export const useInputTrades = () => useContext(InputTradesContext)
export const useInputTradesDispatch = () =>
  useContext(InputTradesDispachContext)

function InputTradesReducer(
  tradeGroups: TradeRecord[][],
  action: InputTradesAction
): TradeRecord[][] {
  console.log('in input reducer')
  switch (action.type) {
    case 'push':
      return [...tradeGroups, [action.trade]]
    case 'pushInGroup':
      return tradeGroups.map((trades) => {
        return trades.flatMap((trade) => {
          if (trade.id != action.id) return trade
          return [trade, { ...trade, id: HashStr.randCode() }]
        })
      })
    case 'add':
      console.log('in add')
      return [...tradeGroups, [initializeTrade()]]
    case 'delete':
      return tradeGroups
        .map((trades) => {
          return trades.filter((trade) => {
            return trade.id !== action.id
          })
        })
        .filter((trades) => trades.length)
    case 'update':
      return tradeGroups.map((trades) => {
        if (trades.map((trade) => trade.id).includes(action.trade.id)) {
          return trades.map((trade) => {
            if (trade.id == action.trade.id) return action.trade
            return {
              ...trade,
              date: action.trade.date,
              symbol: action.trade.symbol,
              tradeType: action.trade.tradeType,
              holdType: action.trade.holdType,
            }
          })
        }
        return trades
      })
    case 'reset':
      return [[initializeTrade()]]
  }
}
