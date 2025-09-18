import type { PnLInterval, TradeRecordPnL } from 'src/types/PnLType'
import { aggregateTradePnL } from './aggregateTradePnL'
import { findIntervalPnLByDate } from './findIntervalPnLByDate'
import { getPnL } from './getPnL'

interface ITradeAnalyzeable {
  selectedDate: Date
  selectedInterval: PnLInterval
  groupedByPeriodPnL: TradeRecordPnL[][][]
  selectedPeriodPnL: TradeRecordPnL[][]
  totalPnL: number
  periodPnL: number
}

export class TradeAnalyzer implements ITradeAnalyzeable {
  private _trades: TradeRecordPnL[] = []

  private _selectedDate: Date = new Date()
  private _selectedInterval: PnLInterval = '1d'

  groupedByPeriodPnL: TradeRecordPnL[][][]
  selectedPeriodPnL: TradeRecordPnL[][]
  totalPnL = 0
  periodPnL: number

  constructor(trades: TradeRecordPnL[]) {
    this._trades = trades
    for (let i = 0; i < trades.length; i++) {
      this.totalPnL += getPnL(trades[i])
    }
    this.selectedDate = trades.length
      ? new Date(trades[trades.length - 1].date)
      : new Date()

    this.groupedByPeriodPnL = aggregateTradePnL(this.selectedInterval, trades)
    this.selectedPeriodPnL = findIntervalPnLByDate(
      this.groupedByPeriodPnL,
      this.selectedDate,
      this.selectedInterval
    )

    this.periodPnL = this.getPeriodPnL()
  }

  set selectedInterval(interval: PnLInterval) {
    this._selectedInterval = interval

    this.groupedByPeriodPnL = aggregateTradePnL(interval, this._trades)
    this.selectedPeriodPnL = findIntervalPnLByDate(
      this.groupedByPeriodPnL,
      this.selectedDate,
      interval
    )

    this.periodPnL = this.getPeriodPnL()
  }

  get selectedInterval() {
    return this._selectedInterval
  }
  set selectedDate(date: Date) {
    this._selectedDate = date

    this.selectedPeriodPnL = findIntervalPnLByDate(
      this.groupedByPeriodPnL,
      this.selectedDate,
      this.selectedInterval
    )
    this.periodPnL = this.getPeriodPnL()
  }
  get selectedDate() {
    return this._selectedDate
  }

  private getPeriodPnL = () => {
    let pPnL = 0
    for (let i = 0; i < this.selectedPeriodPnL.length; i++) {
      for (let j = 0; j < this.selectedPeriodPnL[i].length; j++) {
        pPnL += getPnL(this.selectedPeriodPnL[i][j])
      }
    }
    return pPnL
  }
}
