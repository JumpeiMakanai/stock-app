import { priceFormatter } from 'renderer/hooks/priceFormatter'

const splitLine = {
  lineStyle: {
    width: 0.5,
    color: 'rgba(255,255,255,0.4)',
  },
}

export const markLineOpt = {
  animation: false,
  label: {
    align: 'right',
  },
  lineStyle: {
    color: '#ccf',
    type: 'solid',
  },
  tooltip: {
    show: false,
  },
  data: [[]],
}

export const scatterOption = {
  grid: {
    top: 10,
    bottom: 15,
    left: 50,
    borderWidth: 0,
  },
  xAxis: {
    axisLabel: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        width: 0.5,
        color: 'white',
      },
    },
    axisTick: {
      show: false,
    },
    splitLine,
    scale: true,
  },
  yAxis: {
    axisLabel: {
      fontSize: '8px',
      color: 'white',
    },
    splitLine,
    scale: true,
  },
  tooltip: {
    position: function (
      pos: number[],
      _params: any,
      _el: any,
      _elRect: any,
      size: { contentSize: number[]; viewSize: number[] }
    ) {
      const obj: { [position: string]: number } = {}
      if (pos[1] < size.viewSize[1] / 2) obj.top = pos[1] - 10
      else obj.top = pos[1] - size.contentSize[1]
      if (pos[0] < size.viewSize[0] / 2) obj.left = pos[0] + 10
      else obj.left = pos[0] - (size.contentSize[0] + 10)
      obj.bottom = 5
      return obj
    },
    formatter: (params: any) => {
      if (!params) return

      let dataStr = `<div>${params.marker}${params.seriesName}</div>`

      params.data.forEach((value: number, index: number) => {
        let data = ''
        if (index == 0) {
          const ms = 1000
          const mMs = 60 * ms
          const hMs = mMs * 60
          const dMs = hMs * 24
          if (value >= dMs) {
            const d = Math.floor(value / dMs)
            data += `${d}日`
            value -= d * dMs
          }
          if (value >= hMs) {
            const h = Math.floor(value / hMs)
            data += `${h}時間`
            value -= h * hMs
          }
          if (value >= mMs) {
            const m = Math.floor(value / mMs)
            data += `${m}分`
          }
        } else {
          data = priceFormatter(value) + '円'
        }
        dataStr += `
              <div style='display: flex'>
                  <div style='margin-left: 3%'>
                  ${index == 0 ? '経過時間' : '損益'}
                  </div>
                  <div style='margin-left: auto; margin-right: 3%; font-weight: 400'>${data}</div>
              </div>
          `
      })
      return dataStr
    },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: 6,
      // prettier-ignore
      data: [[1, 3]],
    },
  ],
}
