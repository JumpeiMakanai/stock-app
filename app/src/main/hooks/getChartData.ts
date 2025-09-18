import yahooFinance from 'yahoo-finance2'
import { ChartOptions } from 'yahoo-finance2/dist/esm/src/modules/chart'
//import { YFOptions } from '../../types/yfTypes'

/**
 *yahoo-financeから株式データを取得
 *
 * @param symbol 銘柄名
 * @param queryOptions.interval 足の間隔
 * @param queryOptions.period1 開始日時
 * @param queryOptions.period2 終了日時
 * @returns yahoo-finenceからの株式データ
 */
export const yfGetChartData = async (
  symbol: string,
  queryOptions: YFOptions
): Promise<YFChartObject[]> => {
  const qo = queryOptions as ChartOptions
  qo.return = 'array'
  const chart = await yahooFinance.chart(symbol, qo)
  return chart.quotes
}
