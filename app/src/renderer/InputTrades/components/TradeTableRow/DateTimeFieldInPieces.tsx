import React, { useMemo, useState } from 'react'

import { NumberInput } from 'renderer/Parts/InputField/NumberInput'

export const DateTimeFieldInPieces = ({
  value,
  onChange,
}: {
  value: Date
  onChange: (date: Date) => void
}) => {
  const [dateMap, setDateMap] = useState<Record<string, number>>({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    date: value.getDate(),
    hour: value.getHours(),
    minute: value.getMinutes(),
  })

  const maxDate = useMemo(() => {
    const date = new Date(value)
    date.setFullYear(date.getFullYear(), date.getMonth(), 0)
    return date.getDate()
  }, [dateMap])

  const dateTimeMap = [
    { series: 'year', min: 0, max: 9999, suffix: '/' },
    { series: 'month', min: 1, max: 12, suffix: '/' },
    { series: 'date', min: 1, max: maxDate, suffix: <>&thinsp;</> },
    { series: 'hour', min: 0, max: 23, suffix: ':' },
    { series: 'minute', min: 0, max: 59, suffix: '' },
  ]

  const changeDate = (series: string, value: number) => {
    const newDateMap = {
      ...dateMap,
      [series]: value,
    }

    console.log('a')

    const newDate = new Date(
      newDateMap.year,
      newDateMap.month - 1,
      newDateMap.date,
      newDateMap.hour,
      newDateMap.minute
    )

    console.log(newDate)

    onChange(newDate)
    setDateMap(newDateMap)
  }

  return (
    <div
      style={{
        width: 'fit-content',
        height: '23px',
        padding: '0 2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F3F7E',
      }}
    >
      {dateTimeMap.map(({ series, min, max, suffix }) => {
        const width = series == 'year' ? 27 : 14
        const padding = series == 'hour' ? '0 0 0 2px' : '0 2px 0 0'
        return (
          <React.Fragment key={series}>
            <NumberInput
              value={dateMap[series]}
              style={{
                width,
                padding,
                margin: 0,
                outline: 'none',
                textAlign: 'center',
              }}
              min={min}
              max={max}
              onBlur={(value) => changeDate(series, value)}
            />
            {<p>{suffix}</p>}
          </React.Fragment>
        )
      })}
    </div>
  )
}
