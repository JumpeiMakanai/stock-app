import _ from 'lodash'

const turnedTradeType = (type: TradeType): TradeType => {
  if (type == '現物買') return '現物売'
  else if (type == '現物売') return '現物買'
  else if (type == '信用返済買') return '信用新規売'
  else if (type == '信用返済売') return '信用新規買'
  else if (type == '信用新規買') return '信用返済売'
  return '信用返済買'
}

const isEntryTradeType = (
  type: TradeType
): type is '現物買' | '信用新規買' | '信用新規売' => {
  return ['現物買', '信用新規買', '信用新規売'].includes(type)
}

function isTradeRecordCamel(record: any): record is TradeRecord {
  return (
    record.id !== undefined &&
    record.date !== undefined &&
    record.code !== undefined &&
    record.tradeType !== undefined &&
    record.holdType !== undefined &&
    record.quantity !== undefined &&
    record.price !== undefined &&
    record.fee !== undefined &&
    record.tax !== undefined
  )
}

function isTradeRecordSnake(record: any): record is TradeRecordDB {
  return (
    record.id !== undefined &&
    record.date !== undefined &&
    record.code !== undefined &&
    record.trade_type !== undefined &&
    record.hold_type !== undefined &&
    record.quantity !== undefined &&
    record.price !== undefined &&
    record.fee !== undefined &&
    record.tax !== undefined
  )
}

function objectToCamelCase(obj: TradeRecord): TradeRecord
function objectToCamelCase(obj: { [key: string]: any }): any
function objectToCamelCase(obj: { [key: string]: any } | TradeRecord) {
  const objCamel = _.mapKeys(obj, (v, k) => _.camelCase(k))
  if (isTradeRecordCamel(objCamel)) return objCamel
  return objCamel
}

function objectToSnakeCase(obj: TradeRecord): TradeRecordDB
function objectToSnakeCase(obj: { [key: string]: any }): any
function objectToSnakeCase(obj: { [key: string]: any } | TradeRecordDB) {
  const objSnake = _.mapKeys(obj, (v, k) => _.snakeCase(k))
  if (isTradeRecordSnake(objSnake)) return objSnake
  return objSnake
}

export {
  turnedTradeType,
  isEntryTradeType,
  objectToCamelCase,
  objectToSnakeCase,
}
