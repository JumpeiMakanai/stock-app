//import { YFChartObject } from '../../../../../types/yfTypes'
import { getCloserDay } from 'renderer/TradesHistory/hooks/getCloserDay'
import { NewTradeTypeArray, RepayTradeTypeArray } from 'src/types/TradeObject'
import type { TradeRecordRaw } from 'src/types/TradeType'
import type { YFInterval, YFChartObject } from 'src/types/yfTypes'

type EChartsData = {
  xAxisData: string[]
  xAxisData0: string[]
  xAxisData1: string[]
  xAxisData2: number[]
  yAxisData: number[][]
  buyLineData: ({ xAxis: string } | { yAxis: number })[]
  sellLineData: ({ xAxis: string } | { yAxis: number })[]
  splitAreaData: string[]
}

const m: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
}
const d: Intl.DateTimeFormatOptions = {
  month: 'numeric',
}
const mo: Intl.DateTimeFormatOptions = {
  year: 'numeric',
}
const formatMap: Record<YFInterval, Intl.DateTimeFormatOptions> = {
  ...Object.fromEntries(
    (['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h'] as const).map(
      (key) => [key, m]
    )
  ),
  ...Object.fromEntries(['1d', '5d', '1wk'].map((key) => [key, d])),
  ...Object.fromEntries(['1mo', '3mo'].map((key) => [key, mo])),
} as Record<YFInterval, Intl.DateTimeFormatOptions>

const mF: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}
const dF: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}
const moF: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
}
const formatFullMap: Record<YFInterval, Intl.DateTimeFormatOptions> = {
  ...Object.fromEntries(
    (['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h'] as const).map(
      (key) => [key, mF]
    )
  ),
  ...Object.fromEntries(['1d', '5d', '1wk'].map((key) => [key, dF])),
  ...Object.fromEntries(['1mo', '3mo'].map((key) => [key, moF])),
} as Record<YFInterval, Intl.DateTimeFormatOptions>

/**
 * 履歴データをチャート用に成型
 * @param yfChartDatas yahoo-financeAPIからの株式価格オブジェクト
 * @param interval 足の間隔
 * @returns eCharts用の軸データとマークラインデータ
 */
export const toEChartsData = (
  yfChartDatas: YFChartObject[],
  trades: TradeRecordRaw[],
  interval: YFInterval = '5m'
): EChartsData => {
  const newTrades = trades.filter((trade) =>
    NewTradeTypeArray.includes(trade.tradeType)
  )
  const repayTrades = trades.filter((trade) =>
    RepayTradeTypeArray.includes(trade.tradeType)
  )

  // 取引日に最も近いチャートデータ内の日付
  // 新規取引日
  const newTradeCloserDates: Date[] = []
  // 返済取引日
  const repayTradeCloserDates: Date[] = []
  const eChartsData: EChartsData = {
    xAxisData: [],
    xAxisData0: [],
    xAxisData1: [],
    xAxisData2: [],
    yAxisData: [],
    buyLineData: [],
    sellLineData: [],
    splitAreaData: [],
  }

  // 前のデータの日時
  let preDate = yfChartDatas.length ? yfChartDatas[0].date : new Date()

  newTrades.forEach(() => newTradeCloserDates.push(preDate))
  repayTrades.forEach(() => repayTradeCloserDates.push(preDate))

  for (let i = 0; i < yfChartDatas.length; i++) {
    const chartData = yfChartDatas[i]
    if (!chartData.open) {
      continue
    }

    const y = [
      chartData.open,
      chartData.close,
      chartData.low,
      chartData.high,
    ].map((value) => Math.round(value * 100) / 100)

    /**
     * 各軸にデータを挿入
     * @param bottomLabelPosition 底のレーベルを表示する位置
     * @param isSeparated 空データを入れるかどうか
     * @param separatedLabel 空データのレーベル
     */
    const addAxisLabel = (
      bottomLabelPosition: 'data' | 'separator',
      isSeparated: boolean,
      separatedLabel: string
    ) => {
      if (isSeparated) {
        eChartsData.xAxisData.push(separatedLabel)
        eChartsData.xAxisData0.push(
          bottomLabelPosition == 'separator'
            ? date.toLocaleString('en-GB', formatMap[interval])
            : ''
        )
        eChartsData.xAxisData1.push(separatedLabel)
        eChartsData.xAxisData2.push(date.getTime())
        eChartsData.yAxisData.push([])
        //eChartsData.separateLineData.push({ xAxis: label })
      }

      eChartsData.xAxisData0.push(
        bottomLabelPosition == 'data'
          ? date.toLocaleString('en-GB', formatMap[interval])
          : ''
      )
    }

    // 前のデータの日時要素
    const date: Date = chartData.date

    /* 一定間隔で上部に日付表示
     足の間隔によってDateのフォーマットを変える */
    switch (interval) {
      case '1d':
      case '5d':
      case '1wk':
        addAxisLabel(
          'separator',
          date.getMonth() !== preDate.getMonth(),
          date.getFullYear() !== preDate.getFullYear()
            ? `${date.getFullYear()}`
            : ''
        )
        break
      case '1mo':
      case '3mo':
        addAxisLabel(
          'separator',
          date.getFullYear() !== preDate.getFullYear(),
          ''
        )
        break
      // 1m - 90m , 1h
      default:
        addAxisLabel(
          'data',
          date.getDate() !== preDate.getDate(),
          `${date.getDate()}`
        )
    }

    // separator
    eChartsData.xAxisData1.push('')
    // tooltip
    eChartsData.xAxisData.push(
      date.toLocaleString('ja-JP', formatFullMap[interval])
    )
    eChartsData.xAxisData2.push(0)
    //eChartsData.xAxisData1.push(addDateLabel())

    eChartsData.yAxisData.push(y)

    // markline date push
    newTrades.forEach((trade, index) => {
      newTradeCloserDates[index] = getCloserDay(
        trade.date,
        date,
        newTradeCloserDates[index]
      )
    })
    repayTrades.forEach((trade, index) => {
      repayTradeCloserDates[index] = getCloserDay(
        trade.date,
        date,
        repayTradeCloserDates[index]
      )
    })

    preDate = date
  }

  // markline
  eChartsData.buyLineData.push(
    {
      xAxis: newTradeCloserDates.length
        ? newTradeCloserDates[0].toLocaleString(
            'ja-JP',
            formatFullMap[interval]
          )
        : '-----',
    }
    // ...newTradeCloserDates.map((date) => {
    //   return { xAxis: date.toLocaleString('ja-JP', formatFullMap[interval]) }
    // })
  )
  // eChartsData.buyLineData.push(
  //   ...newTrades.map((trade) => {
  //     return { yAxis: trade.price }
  //   })
  // )
  eChartsData.sellLineData.push(
    {
      xAxis: repayTradeCloserDates.length
        ? repayTradeCloserDates[
            repayTradeCloserDates.length - 1
          ].toLocaleString('ja-JP', formatFullMap[interval])
        : '-----',
    }
    // ...repayTradeCloserDates.map((date) => {
    //   return { xAxis: date.toLocaleString('ja-JP', formatFullMap[interval]) }
    // })
  )
  // eChartsData.sellLineData.push(
  //   ...repayTrades.map((trade) => {
  //     return { yAxis: trade.price }
  //   })
  // )

  return eChartsData
}
