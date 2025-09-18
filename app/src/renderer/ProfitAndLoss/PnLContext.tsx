// import {
//   createContext,
//   useContext,
//   useReducer,
//   Dispatch,
//   useEffect,
// } from 'react'

// type PnLAction = { trades: TradeRecordPnL[] }

// const PnLContext = createContext<TradeRecordPnL[]>([])
// const PnLDispachContext = createContext<Dispatch<PnLAction> | null>(null)

// export function PnLProvider({ children }: { children: any }) {
//   const [tradePnLs, dispatch] = useReducer(PnLReducer, [] as TradeRecordPnL[])

//   useEffect(() => {
//     window.crudAPI
//       .select({ mode: 'PnL' })
//       .then((trades) => {
//         dispatch({ trades: trades })
//       })
//       .catch((e) => {
//         console.log(e)
//       })
//   }, [])

//   return (
//     <div>
//       <PnLContext.Provider value={tradePnLs}>{children}</PnLContext.Provider>
//     </div>
//   )
// }

// export const usePnL1 = () => useContext(PnLContext)

// function PnLReducer(_: TradeRecordPnL[], action: PnLAction): TradeRecordPnL[] {
//   return action.trades
// }
