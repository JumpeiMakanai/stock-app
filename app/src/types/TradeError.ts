export class TradeDBError extends Error {
  failId: string

  constructor(tradeId: string, message = 'データベース操作に失敗しました') {
    super(message)

    this.name = 'TradeDBError'
    this.failId = tradeId

    Object.setPrototypeOf(this, TradeDBError.prototype)
  }
}
