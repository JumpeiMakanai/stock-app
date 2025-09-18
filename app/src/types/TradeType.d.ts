export type TradeType =
  | '現物買'
  | '現物売'
  | '信用新規買'
  | '信用新規売'
  | '信用返済買'
  | '信用返済売'

export type HoldType = '一般' | '特定' | 'NISA'

export type TradeRecord = {
  id: string
  date: number
  symbol: string
  tradeType: TradeType
  holdType: HoldType
  quantity: number
  restQuantity?: number
  price: number
  fee: number
  tax: number
}

export type TradeRecordDB = {
  id: string
  date: number
  symbol: string
  trade_type: TradeType
  hold_type: HoldType
  quantity: number
  rest_quantity: number
  price: number
  fee: number
  tax: number
}

export type TradeRecordRaw = {
  holdType: HoldType
  price: number
  restQuantity: number
} & TradeRecordBase

export type TradeRecordBase = {
  businessTypeCode: string
  businessTypeName: string
  company: string
  tradeType: TradeType
  date: Date | string | number
  fee: number
  id: string
  market: string
  place: '東証' | '札証' | '福証' | '名証'
  placeYF: '.T' | '.S' | '.F' | '.N'
  quantity: number
  restQuantity: number
  symbol: string
  tax: number
}

export type trade_data_key =
  | 'date'
  | 'symbol'
  | 'trade_type'
  | 'hold_type'
  | 'quantity'
  | 'rest_quantity'
  | 'price'
  | 'fee'
  | 'tax'

/**
 * @mode raw: 売り買いの履歴そのまま。PnL: 集計。
 * @id 履歴のid。指定した場合、filterは無視される
 * @limit 取得するレコードの数
 * @period1 開始日
 * @period2 終了日 指定されなければ、period1 ~ 今日 になる
 * @symbol 銘柄コード
 * @tradeType 取引区分
 * @holdType 預かり区分
 * @price 最低価格と最高価格
 * @place 取引所
 * @businessCode 業種コード
 */
export type SelectFilterOptions = ModeFilterOptions & BaseFilterOptions
export type ModeFilterOptions = { mode: 'raw' } | { mode: 'PnL' }
export type BaseFilterOptions = {
  id?: string
  limit?: number
  order?: 'ASC' | 'DESC'
  filter?: {
    period1?: number
    period2?: number
    symbol?: string
    tradeType?: TradeType
    holdType?: HoldType
    price?: { Lowest: number; Highest: number }
    place?: string
    businessCode?: string
  }
}
