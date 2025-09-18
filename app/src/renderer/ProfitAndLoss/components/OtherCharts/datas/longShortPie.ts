import { getPnL } from 'renderer/ProfitAndLoss/hooks/getPnL'

export const toLongShortPie = (tradePnLs: TradeRecordPnL[][]) => {
  const data: {
    name: string
    value: number
    color: string
  }[] = [
    {
      name: 'Long plus',
      value: 0,
      color: '#d33',
    },
    {
      name: 'Long minus',
      value: 0,
      color: '#e55',
    },
    {
      name: 'Short plus',
      value: 0,
      color: '#33d',
    },
    {
      name: 'Short minus',
      value: 0,
      color: '#55e',
    },
  ]

  for (const trades of tradePnLs) {
    for (const trade of trades) {
      const { tradeType } = trade

      const amount = getPnL(trade)

      if (tradeType === '現物売' || tradeType === '信用返済売') {
        if (amount > 0) {
          data[0].value += amount // Long plus
        } else if (amount < 0) {
          data[1].value += Math.abs(amount) // Long minus
        }
      } else if (tradeType === '信用返済買') {
        if (amount > 0) {
          data[2].value += amount // Short plus
        } else if (amount < 0) {
          data[3].value += Math.abs(amount) // Short minus
        }
      }
    }
  }

  return data
}
