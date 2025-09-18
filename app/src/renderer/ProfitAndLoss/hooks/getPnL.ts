import type { TradeRecordPnL } from "src/types/PnLType"

export const getPnL = (tradePnL: TradeRecordPnL) => {
  const digit = 100
  const { tradeType } = tradePnL
  let { newTradePrice, repayTradePrice } = tradePnL

  // 浮動小数点の演算誤差を修正するため切り捨て
  newTradePrice = Math.floor(newTradePrice * digit)
  repayTradePrice = Math.floor(repayTradePrice * digit)

  const priceDiff =
    tradeType == '信用返済買' || tradeType == '信用新規売'
      ? newTradePrice - repayTradePrice
      : repayTradePrice - newTradePrice
  return (priceDiff / digit) * tradePnL.quantity - (tradePnL.fee + tradePnL.tax)
}
