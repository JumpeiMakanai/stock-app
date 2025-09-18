import React, { useEffect, useMemo, useState } from 'react'

import { NumberInput } from './InputField/NumberInput'

export const DateTimeFieldInPieces = ({
  value,
  onChange,
}: {
  value: Date
  onChange: (date: Date) => void
}) => {
  const getDateMapByDate = (date: Date) => {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    }
  }

  const [dateMap, setDateMap] = useState<Record<string, number>>(
    getDateMapByDate(value)
  )
  useEffect(() => {
    setDateMap(getDateMapByDate(value))
  }, [value])

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

    const newDate = new Date(
      newDateMap.year,
      newDateMap.month - 1,
      newDateMap.date,
      newDateMap.hour,
      newDateMap.minute
    )
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
