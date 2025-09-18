/**
 * 履歴チャートのオプション
 */

// static
const axisPointer = {
  link: [{ xAxisIndex: 'all' }],
  show: true,
}
const grid = [
  {
    show: true,
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    containLabel: true,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderWidth: 0,
  },
]
const yAxis = {
  scale: true,
  splitArea: {
    show: true,
  },
  position: 'right',
  splitLine: {
    lineStyle: {
      width: 0.3,
    },
  },
  axisLabel: {
    fontSize: 10,
    color: 'white',
  },
  axisPointer: {
    label: {
      fontSize: 9,
    },
  },
}
const tooltip = {
  trigger: 'axis',
  xAxisIndex: 0,
  axisPointer: {
    type: 'cross',
  },
  textStyle: {
    fontFamily: 'monospace',
  },
  position: function (
    pos: number[],
    _params: any,
    _el: any,
    _elRect: any,
    size: { contentSize: number[]; viewSize: number[] }
  ) {
    const obj: { [position: string]: number } = { top: 10 }
    if (pos[0] < size.viewSize[0] / 2) obj.right = 55
    else obj.left = 10
    return obj
  },
  formatter: (params: any) => {
    if (!params.length || !params[0].axisValue || params[0].data.length !== 5)
      return

    params = params[0]
    let dataStr = `<div>${params.marker}${params.axisValue}</div>`

    const labelMap = ['始値', '終値', '安値', '高値']
    params.data.forEach((value: number, index: number) => {
      if (index == 0) return
      dataStr += `
            <div style='display: flex'>
                <div style='margin-left: 3%'>
                ${labelMap[index - 1]}
                </div>
                <div style='margin-left: auto; margin-right: 3%; font-weight: bold'>${value}</div>
            </div>
        `
    })
    return dataStr
  },
  animation: false,
}

const dataZoom = [
  {
    type: 'inside',
    start: 98,
    end: 100,
    minValueSpan: 50,
  },
  {
    show: true,
    type: 'slider',
    bottom: 17,
    height: 20,
    start: 98,
    end: 100,
    minValueSpan: 50,
    labelFormatter: () => '',
  },
]

/** 動的 */
// tooptip markline
export const xAxis = {
  type: 'category',
  data: [] as string[],
  show: false,
  // 左右の境界線に重なるようになる
  boundaryGap: false,
  position: 'bottom',
  axisLine: {
    show: false,
    LineStyle: {
      opacity: 0,
    },
  },
  axisPointer: {
    show: true,
    label: {
      show: false,
    },
  },
}
// label用
export const xAxis0 = {
  ...xAxis,
  show: true,
  splitLine: { show: false },
  axisTick: {
    show: true,
    alignWithLabel: true,
    lineStyle: {
      color: 'gray',
      type: 'solid', //[0.5, 2.5],
      opacity: 0.2,
    },
  },
  axisLabel: {
    align: 'center',
    color: 'white',
    fontSize: 10,
    interval: (index: number, value: string) => {
      return value != ''
    },
  },
  axisPointer: {
    show: false,
  },
}
// separator用
export const xAxis1 = {
  ...xAxis0,
  position: 'top',
  axisLabel: {
    align: 'left',
    color: 'white',
    fontSize: 9,
    interval: (index: number, value: string) => {
      return value != ''
    },
  },
  axisPointer: {
    show: false,
  },
}
// 本データ用
export const series = {
  type: 'candlestick',
  barWidth: '85%',
  xAxisIndex: 0,
  itemStyle: {
    color: '#FF0055',
    color0: '#12DDD6',
    borderColor: '#FF0055',
    borderColor0: '#12DDD6',
  },
  data: [] as number[][],
  markLine: {
    data: [],
  },
}
// separator markline
export const series0 = {
  type: 'candlestick',
  xAxisIndex: 2,
  data: [],
  markLine: {
    data: [],
  },
}

export const buyLine = {
  symbol: 'none',
  silent: true,
  lineStyle: {
    color: '#f40',
    type: [1, 1.5],
    opacity: 0.5,
  },
  emphasis: {
    disabled: true,
  },
  label: { show: false },
  animation: false,
}

export const sellLine = {
  ...buyLine,
  lineStyle: {
    color: '#40f',
    type: [1, 1.5],
    opacity: 0.7,
  },
}

export const separatorLine = {
  symbol: 'none',
  silent: true,
  lineStyle: {
    color: 'gray',
    type: 'solid',
    opacity: 0.4,
  },
  emphasis: {
    disabled: true,
  },
  label: { show: false },
  animation: false,
}

/**
 * eChartsの初期設定
 */
export const initialEchartsOption = {
  axisPointer,
  grid,
  xAxis: [],
  yAxis,
  series: [],
  tooltip,
  dataZoom,
}
