import { priceFormatter } from 'renderer/hooks/priceFormatter'
import { getPnL } from '../../hooks/getPnL'
import { formatToDateTime } from 'renderer/TradesHistory/hooks/formatToTime'
import type { PnLDetails, TradeRecordPnL } from 'src/types/PnLType'

/** 損益リスト */
export const PnLList = ({ tradePnLs }: { tradePnLs: TradeRecordPnL[][] }) => {
  /** 損益データを成形して返す */
  const getPnLs = () => {
    return tradePnLs.map((trades) => {
      const intervalPnLDetails: PnLDetails = {
        periodPnL: 0,
        period1: new Date(trades[0].date),
        period2: new Date(),
        quantity: 0,
        tradeNum: 0,
        gain: 0,
        loss: 0,
        fee: 0,
        tax: 0,
      }
      for (const trade of trades) {
        const tradePnL = getPnL(trade)
        intervalPnLDetails.period2 = new Date(trade.date)
        intervalPnLDetails.quantity += trade.quantity
        intervalPnLDetails.tradeNum += 1
        intervalPnLDetails.gain += tradePnL > 0 ? tradePnL : 0
        intervalPnLDetails.loss += tradePnL < 0 ? tradePnL : 0
        intervalPnLDetails.fee += trade.fee
        intervalPnLDetails.tax += trade.tax
      }
      intervalPnLDetails.periodPnL +=
        intervalPnLDetails.gain +
        intervalPnLDetails.loss -
        (intervalPnLDetails.fee + intervalPnLDetails.tax)
      return intervalPnLDetails
    })
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">期間</th>
            <th scope="col">取引株数</th>
            <th scope="col">取引回数</th>
            <th scope="col">損益合計</th>
            <th scope="col">利益</th>
            <th scope="col">損失</th>
            <th scope="col">手数料</th>
            <th scope="col">税金</th>
          </tr>
        </thead>
        <tbody>
          {getPnLs().map((tradePnL, index) => (
            <tr key={index} className={index % 2 ? 'dark' : 'light'}>
              <td scope="row" align="center">
                <div>{formatToDateTime(tradePnL.period1)}</div>
                <div>~{formatToDateTime(tradePnL.period2)}</div>
              </td>
              <td align="right">{tradePnL.quantity}株</td>
              <td align="right">{tradePnL.tradeNum}回</td>
              <td align="right">{priceFormatter(tradePnL.periodPnL)}円</td>
              <td align="right">{priceFormatter(tradePnL.gain)}円</td>
              <td align="right">{priceFormatter(tradePnL.loss)}円</td>
              <td align="right">{priceFormatter(tradePnL.fee)}円</td>
              <td align="right">{priceFormatter(tradePnL.tax)}円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
