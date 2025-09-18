import { createContext, useContext, useReducer, Dispatch } from 'react'

import HashStr from 'renderer/InputTrades/hooks/Hash11'

type TradeSyncAction =
  | { type: 'initialize'; trades: TradeRecord[] }
  | { type: 'initialize' }
  | { type: 'insert' }
  | { type: 'delete'; id: string }
  | { type: 'deleteCancel'; id: string }
  | { type: 'update'; trade: TradeRecord }
  | { type: 'bulkDelete' }

export interface TradeSyncContextType {
  orgTrades: TradeRecord[] // 取引データの元取引
  modifiedTrades: TradeRecord[][] // 元取引を含む変更される取引データ
  deleteIds: string[]
}

const initialTradeContext: TradeSyncContextType = {
  orgTrades: [],
  modifiedTrades: [],
  deleteIds: [],
}

const TradeSyncContext =
  createContext<TradeSyncContextType>(initialTradeContext)
const TradeSyncDispatchContext =
  createContext<Dispatch<TradeSyncAction> | null>(null)

export function TradeSyncProvider({ children }: { children: any }) {
  const [TradeSync, dispatch] = useReducer(
    TradeSyncReducer,
    initialTradeContext
  )

  return (
    <div>
      <TradeSyncContext.Provider value={TradeSync}>
        <TradeSyncDispatchContext.Provider value={dispatch}>
          {children}
        </TradeSyncDispatchContext.Provider>
      </TradeSyncContext.Provider>
    </div>
  )
}

export const useTradeSync = () => useContext(TradeSyncContext)
export const useTradeSyncDispatch = () => useContext(TradeSyncDispatchContext)

function TradeSyncReducer(
  tradeGroups: TradeSyncContextType,
  action: TradeSyncAction
): TradeSyncContextType {
  const copiedContext: TradeSyncContextType = {
    ...tradeGroups,
    modifiedTrades: [...tradeGroups.modifiedTrades],
    deleteIds: [...tradeGroups.deleteIds],
  }
  switch (action.type) {
    case 'initialize':
      if ('trades' in action) {
        copiedContext.orgTrades = [...action.trades]
        copiedContext.modifiedTrades = action.trades.map((trade) => [
          { ...trade },
        ])
      } else {
        copiedContext.modifiedTrades = copiedContext.orgTrades.map((trade) => [
          { ...trade },
        ])
      }
      copiedContext.deleteIds = []
      break
    case 'insert': {
      const orgTrade = copiedContext.orgTrades[0]
        ? { ...copiedContext.orgTrades[0] }
        : null
      if (orgTrade) {
        orgTrade.id = HashStr.randCode()
        copiedContext.modifiedTrades.push([
          { ...orgTrade, quantity: 0, price: 0, fee: 0, tax: 0 },
        ])
      }
      break
    }
    case 'delete':
      if (
        copiedContext.orgTrades
          .flatMap((trades) => trades)
          .map(({ id }) => id)
          .includes(action.id)
      ) {
        copiedContext.deleteIds.push(action.id)
      } else {
        copiedContext.modifiedTrades = copiedContext.modifiedTrades
          .map((trades) => trades.filter(({ id }) => id !== action.id))
          .filter((trades) => trades.length)
      }

      break
    case 'deleteCancel':
      copiedContext.deleteIds = copiedContext.deleteIds.filter(
        (id) => id !== action.id
      )
      break
    case 'update': {
      copiedContext.modifiedTrades = copiedContext.modifiedTrades.map(
        (trades) => {
          if (!trades.map(({ id }) => id).includes(action.trade.id))
            return trades
          return trades.map((trade) => {
            if (trade.id === action.trade.id) return { ...action.trade }
            return {
              ...trade,
              date: action.trade.date,
              symbol: action.trade.symbol,
              tradeType: action.trade.tradeType,
              holdType: action.trade.holdType,
            }
          })
        }
      )
      break
    }
    case 'bulkDelete': {
      copiedContext.modifiedTrades = copiedContext.modifiedTrades
        .map((trades) =>
          trades.filter(({ id }) => {
            if (
              copiedContext.orgTrades
                .flatMap((trades) => trades)
                .map(({ id }) => id)
                .includes(id)
            ) {
              copiedContext.deleteIds.includes(id) ||
                copiedContext.deleteIds.push(id)
              return true
            }
            return false
          })
        )
        .filter((trades) => trades.length)
      break
    }
  }
  console.log(copiedContext)
  return copiedContext
}
