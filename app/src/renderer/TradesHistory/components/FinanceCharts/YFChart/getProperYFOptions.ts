import { getDaysSince } from 'renderer/TradesHistory/hooks/getDaysSInce'
import { usableInterval } from 'renderer/TradesHistory/hooks/usableInterval'
import type { YFInterval, YFOptions } from 'src/types/yfTypes'

/**
 * 取得可能な期間と現在からの経過日数に制限があるので、
 * 制限に引っかからないように調整する
 * 引っかかった場合はより長い間隔で返す
 * @param interval
 * @param period1
 * @param period2
 * @returns yahoofinanceの制限に引っかからないように調整したオプションを返す
 */
export const getProperYFOptions = (options: YFOptions): YFOptions => {
  const interval = options.interval || '5m'
  const period1 = new Date(options.period1)
  const period2 = options.period2 ? new Date(options.period2) : new Date()
  const today = new Date()

  console.log(options)

  if (period1.getTime() > period2.getTime())
    period1.setFullYear(
      period1.getFullYear(),
      period1.getMonth(),
      period1.getDate() - 3
    )

  // 挿入可能全日数
  let addAbleDays = 0
  // 前後の挿入日数
  const addAbleBeforeAndAfter = () => Math.floor(addAbleDays / 2)
  // 前に挿入可能な日数
  let addAblePast = 0
  // 後に挿入可能な日数
  let addAbleFuture = 0
  // 前後に挿入可能な最大値
  let maxBeforeAndAfter = 1000

  const setPeriod = (diffDate: number) => {
    period1.setDate(period1.getDate() - diffDate)
    //period1.setDate(period1.getDate() - period1.getDay())
    period2.setDate(period2.getDate() + diffDate)
    //period2.setDate(period2.getDate() + (6 - period2.getDay()))
  }

  const setDays = (days: number, past: number) => {
    addAbleDays = days - (getDaysSince(period1, period2) + 1)
    addAblePast = past - (getDaysSince(period1, today) + 1)
    addAbleFuture = getDaysSince(period2, today) + 1
  }

  // intervalの制限確認
  // 引っかかっていればさらに長い間隔で返す
  if (!usableInterval(period1, period2).includes(interval))
    return getProperYFOptions({
      ...options,
      interval: usableInterval<YFInterval>(period1, period2)[0],
    })

  // 期間：8日 過去：30日前
  if (interval === '1m') {
    setDays(8, 30)
    console.log(addAbleDays, addAblePast, addAbleFuture)
    console.log(getDaysSince(period1, period2))

    // 期間：60日 過去：60日前
  } else if (['2m', '5m', '15m', '30m', '90m'].includes(interval)) {
    setDays(60, 60)

    // 前後に入れる日数の最大値
    maxBeforeAndAfter = ['2m', '5m', '15m'].includes(interval) ? 2 : 7

    // 期間：730日 過去：730日前
  } else if (['60m', '1h'].includes(interval)) {
    setDays(730, 730)

    // 前後に入れる日数の最大値
    maxBeforeAndAfter = 7

    // 2000年以降 (実際は1995以降)
  } else if (['1d', '5d', '1wk', '1mo', '3mo'].includes(interval)) {
    const date2000 = new Date()
    date2000.setFullYear(2000, 0, 1)
    date2000.setHours(0, 0, 0)

    // 2000以前の場合は2000以降にして返す
    if (2000 > period1.getFullYear()) {
      if (2000 > period2.getFullYear()) period2.setFullYear(2001)
      return getProperYFOptions({
        ...options,
        period1: date2000,
        period2: period2,
      })
    }

    setDays(
      getDaysSince(date2000, new Date()),
      getDaysSince(date2000, new Date())
    )

    if (['1d', '5d'].includes(interval)) maxBeforeAndAfter = 100
    else if ('1wk' == interval) maxBeforeAndAfter = 365
    else maxBeforeAndAfter = 1500
  }

  // 挿入可能日数が最大を超えていた場合は
  // 可能日数を最大値へ変更
  addAbleDays =
    addAbleDays > maxBeforeAndAfter * 2 ? maxBeforeAndAfter * 2 : addAbleDays

  // 前後に挿入可能な日数を限界まで入れる
  const minAbleDays = Math.min(
    addAbleFuture,
    addAblePast,
    addAbleBeforeAndAfter()
  )

  setPeriod(minAbleDays)
  addAbleDays -= minAbleDays * 2

  // 残ったものは過去に優先していれる
  if (addAblePast > minAbleDays)
    period1.setDate(period1.getDate() - addAbleDays)
  else if (addAbleFuture > minAbleDays)
    period2.setDate(period2.getDate() + addAbleDays)

  period1.setHours(0, 0)
  period2.setHours(23, 59)

  return { interval, period1, period2 }
}
