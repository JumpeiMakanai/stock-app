import styled from '@emotion/styled'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useMemo } from 'react'

import { DialogSheet } from 'renderer/Parts/DialogSheet'
import { IconButtonComplete, IconButtonNormal } from 'renderer/Parts/MyMui'
import {
  useFocusedTrades,
  useFocusedTradesDispatch,
} from 'renderer/TradesHistory/FocusedTradesContext'
import { getHistoryTrades } from 'renderer/TradesHistory/hooks/getHistoryTrades'

import { EditRecordTable } from './EditRecordTable'
import { useTradeSync, useTradeSyncDispatch } from '../../../TradeSyncContext'
import type { TradeRecord, TradeRecordRaw } from 'src/types/TradeType'

export const EditSheet = ({
  trades,
  toggleShow,
}: {
  trades: TradeRecordRaw[]
  toggleShow: () => void
}) => {
  const tradeSyncRecord = useTradeSync()
  const syncDispatch = useTradeSyncDispatch()
  const focusedTrades = useFocusedTrades()
  const focusedTradesDispatch = useFocusedTradesDispatch()

  // useEffect(() => {
  //   console.log('useeffect editsheet')
  //   if (!trades) return
  //   const tradeRecord: TradeRecord[] = []
  //   for (const trade of trades) {
  //     tradeRecord.push({
  //       id: trade.id,
  //       date: new Date(trade.date).getTime(),
  //       symbol: trade.symbol,
  //       tradeType: trade.tradeType,
  //       holdType: trade.holdType,
  //       quantity: trade.quantity,
  //       restQuantity: trade.restQuantity,
  //       price: trade.price,
  //       fee: trade.fee,
  //       tax: trade.tax,
  //     })
  //   }
  //   console.log(tradeRecord)
  //   dispatch && dispatch({ type: 'initialize', trades: tradeRecord })
  // }, [trades])

  const orgTrades = useMemo(() => {
    console.log('in org memo', tradeSyncRecord.modifiedTrades)
    return tradeSyncRecord.modifiedTrades
      .map((trades) =>
        trades.filter(({ id }) =>
          tradeSyncRecord.orgTrades.map(({ id }) => id).includes(id)
        )
      )
      .filter((trades) => trades.length)
  }, [tradeSyncRecord.modifiedTrades, tradeSyncRecord.orgTrades])

  const newTrades = useMemo(() => {
    return tradeSyncRecord.modifiedTrades
      .map((trades) =>
        trades.filter(
          ({ id }) =>
            !tradeSyncRecord.orgTrades.map(({ id }) => id).includes(id)
        )
      )
      .filter((trades) => trades.length)
  }, [tradeSyncRecord.modifiedTrades, tradeSyncRecord.orgTrades])

  const handleClose = () => {
    window.electronAPI
      .messageBox({
        type: 'question',
        message: '変更を保存せずに閉じますか？',
        buttons: ['はい', 'いいえ'],
        noLink: true,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          syncDispatch && syncDispatch({ type: 'initialize' })
          toggleShow()
        }
      })
      .catch((e) => console.log(e))
  }

  const handleSave = () => {
    window.electronAPI
      .messageBox({
        type: 'question',
        message: '変更を保存しますか？',
        buttons: ['はい', 'いいえ'],
        noLink: true,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          window.crudAPI
            .sync(tradeSyncRecord)
            .then(() => {
              applyModification()
            })
            .catch((e) => console.log(e))
        }
      })
      .catch((e) => console.log(e))
  }

  const applyModification = () => {
    const selectedId = focusedTrades.selectedId
    const notDeletedTrades = tradeSyncRecord.modifiedTrades
      .flatMap((trades) => trades)
      .filter(({ id }) => !tradeSyncRecord.deleteIds.includes(id))
      // ユーザーが選択した取引を優先する
      .sort(({ id: a }, { id: b }) =>
        a == selectedId ? -1 : b == selectedId ? 1 : 0
      )
    // history apply
    const useHistoryTrade =
      (notDeletedTrades.length && notDeletedTrades[0]) ||
      (tradeSyncRecord.orgTrades.length && tradeSyncRecord.orgTrades[0])
    if (useHistoryTrade) {
      getHistoryTrades(useHistoryTrade.date)
        .then((trades) => {
          focusedTradesDispatch &&
            focusedTradesDispatch({
              type: 'setHistory',
              trades,
              date: new Date(useHistoryTrade.date),
            })
        })
        .catch((e) => console.log(e))

      // selected apply
      window.crudAPI
        .select({ mode: 'raw', id: useHistoryTrade.id })
        .then((trades) => {
          const tradeRecords: TradeRecord[] = []
          trades.forEach((trade) =>
            tradeRecords.push({
              id: trade.id,
              date: new Date(trade.date).getTime(),
              symbol: trade.symbol,
              tradeType: trade.tradeType,
              holdType: trade.holdType,
              quantity: trade.quantity,
              price: trade.price,
              fee: trade.fee,
              tax: trade.tax,
            })
          )
          syncDispatch &&
            syncDispatch({ type: 'initialize', trades: tradeRecords })

          focusedTradesDispatch &&
            focusedTradesDispatch({
              type: 'select',
              trades: trades,
              id: useHistoryTrade.id,
            })

          toggleShow()
        })
        .catch((e) => console.log(e))
    } else {
      // 選択された取引が見つからない場合
      // そんなことないと思うけど
      // 直近の履歴を表示する
      const recentTrades = async () => {
        const [trade] = await window.crudAPI.select({
          mode: 'raw',
          limit: 1,
          order: 'DESC',
        })
        if (!trade) return []
        return await getHistoryTrades(trade.date)
      }
      recentTrades()
        .then(
          (trades) =>
            focusedTradesDispatch &&
            focusedTradesDispatch({
              type: 'setHistory',
              trades,
              date: trades.length ? new Date(trades[0].date) : new Date(),
            })
        )
        .catch((e) => console.log(e))
      focusedTradesDispatch &&
        focusedTradesDispatch({ type: 'select', trades: [], id: '' })
      syncDispatch && syncDispatch({ type: 'initialize', trades: [] })
    }
  }

  return (
    <DialogSheet toggleShow={handleClose}>
      <DialogHeader>
        <IconButtonNormal
          style={{
            height: '40px',
            width: '40px',
            margin: '5px',
            marginRight: 'auto',
          }}
          onClick={handleClose}
        >
          <CloseIcon style={{ color: 'white' }} />
        </IconButtonNormal>
        {[trades[0]?.symbol, trades[0]?.company].map((text, i) => (
          <h3
            key={`${text}-${i}`}
            style={{
              display: 'flex',
              margin: '5px',
              color: '#ccf',
              fontSize: '15px',
              alignItems: 'center',
            }}
          >
            {text || ''}
          </h3>
        ))}
        <IconButtonComplete
          style={{
            height: '40px',
            width: '40px',
            margin: '5px',
            marginLeft: 'auto',
          }}
          onClick={handleSave}
        >
          <CheckIcon style={{ color: 'white' }} />
        </IconButtonComplete>
      </DialogHeader>
      <div style={{ height: 'calc(100% - 50px)', overflow: 'auto' }}>
        <EditRecordTable tradeGroups={orgTrades} />
        <div
          style={{
            height: '40px',
            fontSize: '11px',
            paddingTop: '5px',
            textAlign: 'center',
            display: 'flex',
            cursor: 'pointer',
          }}
          onClick={() => {
            console.log('in clik')
            syncDispatch && syncDispatch({ type: 'insert' })
          }}
        >
          <p style={{ margin: 'auto', fontWeight: 600 }}>新規追加</p>
        </div>
        <EditRecordTable tradeGroups={newTrades} />
      </div>
    </DialogSheet>
  )
}

const DialogHeader = styled.div`
  display: flex;
  height: 50px;
  border-bottom: 2px solid #ccd;
  justify-content: center;
`
