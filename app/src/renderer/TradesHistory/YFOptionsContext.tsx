// import { createContext, Dispatch, useContext, useReducer } from 'react'

// import { getDaysSince } from './hooks/getDaysSInce'
// import { usableInterval } from './hooks/usableInterval'

// type YFOptionsAction = { type: 'set'; options: YFOptions }

// const YFOptionsContext = createContext<YFOptions | null>(null)
// const YFOptionsDispatchContext =
//   createContext<Dispatch<YFOptionsAction> | null>(null)

// function YFOptionsReducer(
//   state: YFOptions,
//   action: YFOptionsAction
// ): YFOptions {
//   return getProperOptions(action.options)
// }

// export function YFOptionsProvider({ children }: { children: any }) {
//   const date = new Date()
//   date.setDate(date.getDate() - 30)
//   const [yfOptions, dispatch] = useReducer(YFOptionsReducer, {
//     interval: '5m',
//     period1: date,
//   })

//   return (
//     <YFOptionsContext.Provider value={yfOptions}>
//       <YFOptionsDispatchContext.Provider value={dispatch}>
//         {children}
//       </YFOptionsDispatchContext.Provider>
//     </YFOptionsContext.Provider>
//   )
// }

// export const useYFOptions = () => useContext(YFOptionsContext)
// export const useYFOptionsDispatch = () => useContext(YFOptionsDispatchContext)
