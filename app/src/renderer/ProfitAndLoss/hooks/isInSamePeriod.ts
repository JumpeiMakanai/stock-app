import type { PnLInterval } from 'src/types/PnLType'
import { getDayCustom } from './getDayCustom'

/**
 * 指定間隔内にどちらの日付も存在するか確認
 * @param interval 指定間隔
 * @param date1
 * @param date2
 * @returns
 */
export const isInSameInterval = (
  interval: PnLInterval,
  date1: Date,
  date2: Date
) => {
  const weekStart1 = new Date(date1)
  weekStart1.setDate(weekStart1.getDate() - getDayCustom(weekStart1))
  const weekEnd1 = new Date(date1)
  weekEnd1.setDate(weekEnd1.getDate() + (6 - getDayCustom(weekEnd1)))

  const sameYear = date1.getFullYear() === date2.getFullYear()
  const sameMonth = sameYear && date1.getMonth() === date2.getMonth()
  const sameDate = sameYear && sameMonth && date1.getDate() == date2.getDate()

  switch (interval) {
    case '1d':
      return sameDate
    case '1w':
      return weekStart1 <= date2 && date2 <= weekEnd1
    case '1mo':
      return sameMonth
    case '1y':
      return sameYear
  }
}

/**
 * 指定間隔内よりも長い間隔にどちらの日付も存在するか確認
 * @param interval 指定間隔
 * @param date1
 * @param date2
 * @returns
 */
export const isInSamePeriod = (
  interval: PnLInterval,
  date1: Date,
  date2: Date
) => {
  const sameYear = date1.getFullYear() === date2.getFullYear()
  const sameMonth = sameYear && date1.getMonth() === date2.getMonth()

  const sameQuarter =
    sameYear &&
    Math.floor(date1.getMonth() / 3) == Math.floor(date2.getMonth() / 3)

  switch (interval) {
    case '1d':
      return sameMonth
    case '1w':
      return sameQuarter
    case '1mo':
      return sameYear
    case '1y':
      return true
  }
}
