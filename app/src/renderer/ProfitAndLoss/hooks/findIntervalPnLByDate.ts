import type { PnLInterval, TradeRecordPnL } from 'src/types/PnLType'
import { getDayCustom } from './getDayCustom'
import { isInSamePeriod } from './isInSamePeriod'

/**
 * 損益データ配列の中に指定日を含むデータをさがす
 * @param groupedByPeriodPnL 損益データ
 * @param selectedDate 表示日
 * @param interval 損益をまとめる間隔
 * @returns 指定日を含むデータ、なければnull
 */
export const findIntervalPnLByDate = (
  groupedByPeriodPnL: TradeRecordPnL[][][],
  selectedDate: Date,
  interval: PnLInterval
) => {
  for (let i = 0; i < groupedByPeriodPnL.length; i++) {
    const groupedByIntervalPnL = groupedByPeriodPnL[i]
    const currDate = new Date(groupedByIntervalPnL[0][0].date)
    if (interval == '1w')
      currDate.setDate(currDate.getDate() - getDayCustom(currDate))
    if (isInSamePeriod(interval, selectedDate, currDate))
      return groupedByIntervalPnL
  }
  return []
}
