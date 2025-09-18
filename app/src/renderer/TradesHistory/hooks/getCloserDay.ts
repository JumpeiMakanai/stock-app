/**
 * 2つの日付のうち、ターゲットの日付により近い方を返す関数
 * @param target - ターゲットの日付
 * @param day1 - 比較する日付1
 * @param day2 - 比較する日付2
 * @returns day1またはday2のうち、ターゲットにより近い日付
 */
export const getCloserDay = (
  target: Date | number | string,
  day1: Date | number | string,
  day2: Date | number | string
): Date => {
  target = new Date(target)
  day1 = new Date(day1)
  day2 = new Date(day2)
  return Math.abs(target.getTime() - day1.getTime()) >
    Math.abs(target.getTime() - day2.getTime())
    ? day2
    : day1
}
