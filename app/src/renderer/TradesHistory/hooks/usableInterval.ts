import { getDaysSince } from './getDaysSInce'

/**
 * 指定された間隔で使用できるinterval
 * @param period1 最初の日
 * @param period2 最後の日
 * @returns
 */
export const usableInterval = <T>(
  period1: Date | number | string,
  period2: Date | number | string
): T extends YFInterval ? YFInterval[] : string[] => {
  const intervals: YFInterval[] = []
  period1 = new Date(period1)
  period2 = period2 ? new Date(period2) : new Date()
  const today = new Date()
  const daysSinceP1 = getDaysSince(period1, today)
  const daysBetweenP1P2 = getDaysSince(period1, period2)

  // 期間：8日 過去：30日前
  if (daysSinceP1 < 30 && daysBetweenP1P2 < 8) {
    intervals.push('1m')
  }

  // 期間：60日 過去：60日前
  if (daysSinceP1 < 60 && daysBetweenP1P2 < 60) {
    intervals.push('2m', '5m', '15m', '30m', '90m')
  }

  // 期間：730日 過去：730日前
  if (daysSinceP1 < 730 && daysBetweenP1P2 < 730) {
    intervals.push('1h')
  }

  intervals.push('1d', '5d', '1wk', '1mo', '3mo')

  return intervals
}
