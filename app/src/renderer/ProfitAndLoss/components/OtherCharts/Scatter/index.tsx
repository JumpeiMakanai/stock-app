import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

import { markLineOpt, scatterOption } from './eChartsOption'
import { correlation } from '../datas/correlation'

export const Scatter = ({
  data,
  title,
  color = ['#5f5'],
}: {
  data: number[][]
  title: string
  color?: string[]
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  let myCharts: echarts.ECharts
  useEffect(() => {
    const { r, m, b } = correlation(data)

    const maxX = Math.max(...data.map((d) => d[0]))
    const minX = Math.min(...data.map((d) => d[0]))
    const maxY = Math.max(...data.map((d) => d[1]))
    const minY = Math.min(...data.map((d) => d[1]))

    let x1 = minX
    let x2 = maxX
    let y1 = m * minX + b
    let y2 = m * maxX + b
    if (r > 0) {
      if (y1 < minY) {
        x1 = (minY - b) / m
        y1 = minY
      }
      if (y2 > maxY) {
        x2 = (maxY - b) / m
        y2 = maxY
      }
    } else {
      if (y1 > maxY) {
        x1 = (maxY - b) / m
        y1 = maxY
      }
      if (y2 < minY) {
        x2 = (minY - b) / m
        y2 = minY
      }
    }

    const point1 = [x1, y1]
    const point2 = [x2, y2]

    myCharts = echarts.init(chartRef.current)
    myCharts?.setOption({
      ...scatterOption,
      color,
      series: {
        ...scatterOption.series[0],
        name: title,
        data,
        markLine: {
          ...markLineOpt,
          // tooltip: {
          //   formatter: `y = ${m.toExponential(2)} * x + ${b.toExponential(2)}`,
          // },
          data: [
            [
              {
                coord: point1,
                symbol: 'none',
              },
              {
                coord: point2,
                symbol: 'none',
              },
            ],
          ],
        },
      },
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
        width: 'calc((30vh)*3)',
        maxWidth: '500px',
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
              <div style=' margin-left: 10px; '>${params.value}${suffix}</div>
          </div>
      `
  }
}
