export const yfIntervalArray = [
  // 期間：8日 過去：30日前
  '1m',
  // 期間：60日 過去：60日前
  '2m',
  '5m',
  '15m',
  '30m',
  '90m',
  // 期間：730日 過去：730日前
  '60m',
  '1h',
  // 1995/5 ~ 多分
  // 一応2000以降にした方がいいかも
  '1d',
  '5d',
  '1wk',
  '1mo',
  '3mo',
] as const
export type YFInterval = (typeof yfIntervalArray)[number]

/**
 * チャート設定
 *
 * @interval 足の間隔
 * @period1 開始日時
 * @period2 終了日時
 */
export type YFOptions = {
  period2?: string | number | Date | undefined
  interval?: YFInterval
  period1: string | number | Date
}

/**
 * yahoo-financeからの株式データ
 */
export type YFChartObject = {
  date: Date
  high: number
  volume: number
  open: number
  low: number
  close: number
  adjclose?: number
}
