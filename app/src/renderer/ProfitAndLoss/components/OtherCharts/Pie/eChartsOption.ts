export const pieOption = {
  tooltip: {
    trigger: 'item',
    valueFormatter: (value: number, i: number) => {
      return Math.floor(value * 100).toString()
    },
  },
  legend: {
    //show: false,
    type: 'scroll',
    orient: 'vertical',
    left: '60%',
    top: '5%',
    bottom: '5%',
    icon: 'circle',
    textStyle: {
      color: 'white',
      fontSize: '10px',
    },
    itemWidth: 15,
    itemHeight: 10,
    itemStyle: {
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 0,
    },
  },
  series: [
    {
      type: 'pie',
      radius: ['0%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#fff',
        borderWidth: 2,
      },
      center: ['28%', '50%'],
      label: {
        show: false,
        position: 'right',
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
}
