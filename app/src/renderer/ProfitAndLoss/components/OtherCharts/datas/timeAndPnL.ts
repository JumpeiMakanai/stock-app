import { getPnL } from 'renderer/ProfitAndLoss/hooks/getPnL'

export const toTimeAndPnLScatterData = (tradePnLs: TradeRecordPnL[]) => {
  const getTime = (date: any) => new Date(date).getTime()
  return tradePnLs.map((trade) => [
    getTime(trade.date) - getTime(trade.date0),
    getPnL(trade),
  ])
}
