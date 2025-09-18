import _ from 'lodash'

import HashStr from 'renderer/InputTrades/hooks/Hash11'
import {
  HoldTypes,
  NewTradeTypeArray,
  RepayTradeTypeArray,
  TradeTypes,
} from 'src/types/TradeObject'

import { calculateSimilarity } from './similar'

export const csvReader = (csv: string[][]) => {
  const trades: TradeRecord[] = []
  const formats = [
    {
      format: sbiTrade0,
      dateIndex: 0,
      symbolIndex: 2,
      tradeTypeIndex: 4,
      holdTypeIndex: 6,
      quantityIndex: 8,
      priceIndex: 9,
      feeIndex: 10,
      taxIndex: 11,
    },
    {
      format: sbiTrade1,
      dateIndex: 6,
      symbolIndex: 0,
      tradeTypeIndex: 3,
      holdTypeIndex: 5,
      quantityIndex: 8,
      priceIndex: 9,
      feeIndex: 10,
      taxIndex: 11,
    },
  ]

  for (const {
    format,
    dateIndex,
    symbolIndex,
    tradeTypeIndex,
    holdTypeIndex,
    quantityIndex,
    priceIndex,
    feeIndex,
    taxIndex,
  } of formats) {
    const titleIndex = indexIn2D(csv, format)
    if (titleIndex !== -1) {
      for (let i = titleIndex + 1; i < csv.length; i++) {
        const targetRecord = csv[i]
        if (targetRecord.length === format.length) {
          trades.push({
            id: HashStr.randCode(),
            date: new Date(targetRecord[dateIndex]).getTime(),
            symbol: targetRecord[symbolIndex],
            tradeType: getClosestString(
              TradeTypes as TradeType[],
              targetRecord[tradeTypeIndex]
            ),
            holdType: getClosestString(
              HoldTypes as HoldType[],
              targetRecord[holdTypeIndex]
            ),
            quantity: Number(targetRecord[quantityIndex].replace(',', '')),
            price: Number(targetRecord[priceIndex].replace(',', '')),
            fee: toNumber(targetRecord[feeIndex]),
            tax: toNumber(targetRecord[taxIndex]),
          })
        }
      }
      break
    }
  }

  const nn = trades.filter(
    (trade) =>
      NewTradeTypeArray.includes(trade.tradeType) && trade.symbol == '7013'
  )
  const rn = trades.filter(
    (trade) =>
      RepayTradeTypeArray.includes(trade.tradeType) && trade.symbol == '7013'
  )

  console.log(nn, rn)

  return trades
}

const toNumber = (value: string): number => {
  const num = Number(value.replace(',', ''))
  return isNaN(num) ? 0 : num
}

const indexIn2D = <T>(arr1: T[][], targetArr: T[]) => {
  for (let i = 0; i < arr1.length; i++) {
    if (_.isEqual(arr1[i], targetArr)) return i
  }
  return -1
}

// 入力に最も近い文字列を返す関数
function getClosestString<T extends string>(stringArr: T[], target: string): T {
  let closestStr = stringArr[0]
  let maxSim = calculateSimilarity(target, closestStr)

  for (const type of stringArr) {
    const distance = calculateSimilarity(target, type)
    if (distance > maxSim) {
      closestStr = type
      maxSim = distance
    }
  }

  return closestStr
}

const sbiTrade0 = [
  '約定日',
  '銘柄',
  '銘柄コード',
  '市場',
  '取引',
  '期限',
  '預り',
  '課税',
  '約定数量',
  '約定単価',
  '手数料/諸経費等',
  '税額',
  '受渡日',
  '受渡金額/決済損益',
]

const sbiTrade1 = [
  '銘柄',
  '銘柄',
  '銘柄',
  '取引区分',
  '期限',
  '預り区分',
  '約定日',
  '受渡日',
  '株数',
  '平均約定単価',
  '手数料・諸経費等',
  '課税額・譲渡益税',
  '受渡金額・決済損益',
  '受渡金額(日計り分)',
]
