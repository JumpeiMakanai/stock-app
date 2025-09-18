/**
 * 2つの日付間の日数を取得する関数
 * @param period1 始めの日
 * @param period2 終わりの日
 * @returns 日数
 */
export const getDaysSince = (period1: Date, period2: Date): number => {
  period1.setHours(0, 0, 0, 0)
  const dMs = 1000 * 60 * 60 * 24
  const diffInTime = period2.getTime() - period1.getTime()
  return Math.floor(diffInTime / dMs) // ミリ秒から日数へ変換
}
