export const formatToTime = (date: Date | number | string) => {
  date = new Date(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

export const formatToDateTime = (date: Date | number | string) => {
  date = new Date(date)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatToDateDay = (date: Date | number | string) => {
  date = new Date(date)
  return `${date.getDate()}日 (${weekDayStr[date.getDay()]})`
}

const weekDayStr = ['日', '月', '火', '水', '木', '金', '土']
