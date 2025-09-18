export const getMonthStartAndEnd = (
  date: Date | number | string
): { period1: Date; period2: Date } => {
  date = new Date(date)
  const period1 = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0) // 月の初日
  const period2 = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59
  ) // 月の最終日
  return { period1, period2 }
}
