export const toBusinessTypePie = (tradePnLs: TradeRecordPnL[][]) => {
  let data: { name: string; value: number; color: string }[] = []
  for (const trades of tradePnLs) {
    for (const trade of trades) {
      if (data.map((d) => d.name).includes(trade.businessTypeName)) {
        data = data.map((d) => {
          d.value += 1
          return d
        })
      } else {
        data.push({
          name: trade.businessTypeName,
          value: 1,
          color: businessColor[trade.businessTypeCode],
        })
      }
    }
  }
  return data
}

const businessColor: Record<string, string> = {
  '0050': '#4F83CC',
  '1050': '#6E2AB8',
  '2050': '#A49261',
  '3050': '#F9C74B',
  '3100': '#56B1BB',
  '3150': '#D67277',
  '3200': '#B2A2F1',
  '3250': '#8F7C6D',
  '3300': '#5E4C95',
  '3350': '#4CAF50',
  '3400': '#F53D3D',
  '3450': '#2EACAC',
  '3500': '#FFD700',
  '3550': '#8A2BE2',
  '3600': '#E9967A',
  '3650': '#7FFF00',
  '3700': '#C71585',
  '3750': '#B0C4DE',
  '3800': '#F0E68C',
  '4050': '#FF6347',
  '5050': '#4682B4',
  '5100': '#6B8E23',
  '5150': '#E0FFFF',
  '5200': '#D2691E',
  '5250': '#BA55D3',
  '6050': '#228B22',
  '6100': '#FF4500',
  '7050': '#ADFF2F',
  '7100': '#9ACD32',
  '7150': '#FF1493',
  '7200': '#00FF7F',
  '8050': '#DAA520',
  '9050': '#EE82EE',
  '-': '#000000',
}
