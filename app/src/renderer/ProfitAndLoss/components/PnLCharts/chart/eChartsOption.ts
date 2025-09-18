/**
 * 損益チャートの初期設定
 */
import { priceFormatter } from '../../../../hooks/priceFormatter'

// static
const grid = [
  {
    left: 10,
    right: 10,
    top: 20,
    bottom: 2,
    containLabel: true,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderWidth: 0,
  },
]
const yAxis = [
  {
    type: 'value',
    axisLabel: {
      fontSize: 10,
      color: 'white',
    },
    splitLine: {
      lineStyle: {
        width: 0.3,
      },
    },
    axisPointer: {
      show: false,
    },
  },
]
const tooltip = {
  trigger: 'axis',
  textStyle: {
    fontFamily: 'monospace',
  },
  valueFormatter: (value: number, _: number) => priceFormatter(value) + '円',
  position: function (
    pos: number[],
    _params: any,
    _el: any,
    _elRect: any,
    size: { contentSize: number[]; viewSize: number[] }
  ) {
    const obj: { [position: string]: number } = { top: 10 }
    if (pos[0] < size.viewSize[0] / 2) obj.right = 20
    else obj.left = 10
    return obj
  },
  animation: false,
}

//
export const xAxis = {
  type: 'category',
  data: [],
  show: false,
  position: 'bottom',
  axisPointer: {
    type: 'shadow',
  },
}

export const xAxis0 = {
  ...xAxis,
  show: true,
  axisTick: {
    show: true,
    alignWithLabel: false,
    inside: false,
  },
  axisLabel: {
    align: 'center',
    color: 'white',
    fontSize: 9,
    interval: (_: number, value: string) => {
      return value != ''
    },
  },
  axisPointer: {
    show: false,
  },
}

export const xAxis1 = {
  ...xAxis,
  boundaryGap: true,
  axisLine: { onZero: false },
  splitLine: { show: false },
  show: true,
  position: 'bottom',
  axisTick: {
    show: true,
    interval: (_: number, value: string) => {
      return value !== ''
    },
    alignWithLabel: false,
    inside: true,
    length: 380,
    lineStyle: {
      color: 'gray',
      type: 'solid', //[0.5, 2.5],
      opacity: 0.2,
    },
  },
  axisLabel: {
    show: false,
  },
  axisPointer: {
    show: false,
  },
}

export const series = {
  name: '経過損益' as const,
  type: 'line',
  itemStyle: {
    color: '#5c5',
  },
  data: [] as number[],
}
export const series0 = {
  name: '期間損益' as const,
  type: 'bar',
  itemStyle: {
    color: (value: any) => {
      return value.value < 0 ? '#c33' : '#33c'
    },
  },
  data: [] as number[],
}

/**
 * eChartsの初期設定
 */
export const initialEchartsOption = {
  //axisPointer,
  grid,
  xAxis: [xAxis, xAxis0, xAxis1],
  yAxis,
  series: [series, series0],
  tooltip,
}
