import { useState } from 'react'

import { StyledInputSelect } from 'renderer/Parts/InputSelect/StyledInputSelect'
import { useFocusedTrades } from 'renderer/TradesHistory/FocusedTradesContext'
import { usableInterval } from 'renderer/TradesHistory/hooks/usableInterval'

//import { YFChart } from './YFChart'
import type { YFInterval } from 'src/types/yfTypes'

//import { YFOptions } from '../../../../types/yfTypes'

export const YFChartWithInterval = () => {
  const [interval, setInterval] = useState<YFInterval>('5m')
  const focusedTrades = useFocusedTrades()

  const period1 = () =>
    focusedTrades.selectedTrades.length
      ? focusedTrades.selectedTrades[0].date
      : new Date()
  const period2 = () =>
    focusedTrades.selectedTrades.length
      ? focusedTrades.selectedTrades[focusedTrades.selectedTrades.length - 1]
          .date
      : new Date()

  return (
    <>
      {!!focusedTrades.selectedTrades?.length && (
        <>
          <StyledInputSelect
            style={{
              width: '90px',
              height: '20px',
              marginTop: '2px',
              fontSize: '11px',
            }}
            value={interval}
            onChange={(e) => setInterval(e.target.value as YFInterval)}
          >
            {Object.keys(intervalMap).map(
              (key) =>
                usableInterval<string>(period1(), period2()).includes(key) && (
                  <option value={key} key={key}>
                    {intervalMap[key]}
                  </option>
                )
            )}
          </StyledInputSelect>
          {/* <YFChart interval={interval} /> */}
        </>
      )}
    </>
  )
}

const intervalMap: Record<string, string> = {
  '1m': '1分',
  '2m': '2分',
  '5m': '5分',
  '15m': '15分',
  '30m': '30分',
  '1h': '1時間足',
  '1d': '日足',
  '1wk': '週足',
  '1mo': '月足',
  '3mo': '四半期足',
}
