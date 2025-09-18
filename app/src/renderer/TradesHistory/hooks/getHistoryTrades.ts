import { getMonthStartAndEnd } from './getMonthStartAndEnd'

export const getHistoryTrades = async (date: Date | number | string) => {
  const { period1, period2 } = getMonthStartAndEnd(date)
  return await window.crudAPI.select({
    mode: 'raw',
    filter: { period1: period1.getTime(), period2: period2.getTime() },
  })
}
