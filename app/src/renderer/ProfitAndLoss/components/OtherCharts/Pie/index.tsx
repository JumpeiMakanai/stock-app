import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { priceFormatter } from 'renderer/hooks/priceFormatter'

import { pieOption } from './eChartsOption'

export const Piee = ({
  data,
  suffix,
}: {
  data: {
    name: string
    value: number
    color: string
  }[]
  suffix?: string
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  let myCharts: echarts.ECharts
  const color = data.map((d) => d.color)
  useEffect(() => {
    myCharts = echarts.init(chartRef.current)
    myCharts?.setOption({
      ...pieOption,
      tooltip: {
        ...pieOption.tooltip,
        formatter: formatter(suffix || ''),
      },
      series: [
        {
          ...pieOption.series[0],
          data,
        },
      ],
      color,
    })
  }, [data])

  window.addEventListener('resize', () => {
    if (myCharts && chartRef) {
      myCharts.resize()
    }
  })

  return (
    <div
      ref={chartRef}
      className="other-size-height"
      style={{
        width: 'calc((30vh)*2)',
        maxWidth: '340px',
        minWidth: '260px',
      }}
    ></div>
  )
}

const formatter = (suffix: string) => {
  return (params: any) => {
    if (!params || !params.data) return
    return `
          <div style='display: flex; font-weight: 400; font-size: 12px; color: #000'>
              <div style='padding: 0; margin: 0;'>${params.marker}</div>
              <div style='padding: 0; margin: 0;'>
              ${params.name}
              </div>
              <div style=' margin-left: 10px; '>${priceFormatter(Number(params.value))}${suffix}</div>
          </div>
      `
  }
}
