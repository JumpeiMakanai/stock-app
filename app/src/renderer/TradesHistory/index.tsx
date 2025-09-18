import { YFChartWithInterval } from './components/FinanceCharts'
import { HistoryList } from './components/HistoryList'
import { TradeDetails } from './components/TradeDetails'
import { FocusedTradesProvider } from './FocusedTradesContext'
import { TradeSyncProvider } from './TradeSyncContext'

import './index.css'

/**
 * 履歴画面のページ
 */
export const TradesHistory = () => {
  return (
    <FocusedTradesProvider>
      <TradeSyncProvider>
        <div
          className="trade-history-container"
          style={{ display: 'flex', width: '100%' }}
        >
          <HistoryList></HistoryList>
          <div className="charts-outer">
            <TradeDetails />
            <YFChartWithInterval />
          </div>
        </div>
      </TradeSyncProvider>
    </FocusedTradesProvider>
  )
}
