import { createContext, useContext, useReducer, type Dispatch } from 'react'
import type { TradeRecordRaw } from 'src/types/TradeType';

type FocusedTradesAction =
  | { type: 'setHistory'; trades: TradeRecordRaw[]; date: Date }
  | { type: 'select'; trades: TradeRecordRaw[]; id: string }

interface FocusedTradesContextType {
  history: TradeRecordRaw[]
  selectedDate: Date
  selectedTrades: TradeRecordRaw[]
  selectedId: string
}

const initialContext = {
  history: [],
  selectedDate: new Date(),
  selectedTrades: [],
  selectedId: '',
}

const FocusedTradesContext =
  createContext<FocusedTradesContextType>(initialContext)
const FocusedTradesDispachContext =
  createContext<Dispatch<FocusedTradesAction> | null>(null)

function FocusedTradesReducer(
  context: FocusedTradesContextType,
  action: FocusedTradesAction
): FocusedTradesContextType {
  switch (action.type) {
    case 'setHistory':
      return {
        history: action.trades,
        selectedDate: action.date,
        selectedTrades: [...context.selectedTrades],
        selectedId: context.selectedId,
      }
    case 'select':
      return {
        history: [...context.history],
        selectedDate: context.selectedDate,
        selectedTrades: action.trades,
        selectedId: action.id,
      }
  }
}

export function FocusedTradesProvider({ children }: { children: any }) {
  const [FocusedTrades, dispach] = useReducer(
    FocusedTradesReducer,
    initialContext
  )

  return (
    <div>
      <FocusedTradesContext.Provider value={FocusedTrades}>
        <FocusedTradesDispachContext.Provider value={dispach}>
          {children}
        </FocusedTradesDispachContext.Provider>
      </FocusedTradesContext.Provider>
    </div>
  )
}

export const useFocusedTrades = () => useContext(FocusedTradesContext)
export const useFocusedTradesDispatch = () =>
  useContext(FocusedTradesDispachContext)
