import { TradeSyncContextType } from 'renderer/TradesHistory/TradeSyncContext'

//import { YFChartObject, YFOptions } from '../types/YFTypes'

export interface IElectronAPI {
  /**
   * メインプロセスへ株式データを要求
   *
   * @param symbol 銘柄コード '7203.T'
   * @param options 足の間隔, 開始日時
   */
  financeData: (symbol: string, interval: YFOptions) => Promise<YFChartObject[]>
  /**
   * メインプロセスへcsvファイルの読み込みを要求
   *
   * @returns csvファイルのデータ
   */
  fileRead: () => Promise<string[][]>
  messageBox: (
    options: Electron.MessageBoxOptions
  ) => Promise<Electron.MessageBoxReturnValue>
}

export interface ICrudAPI {
  /**
   * 取引データの挿入
   *
   * @param tradeDatas
   * @returns void 正常終了
   * @throws { failId: string } 返済取引数量が合わない
   * @throws Error その他エラー
   */
  insert: (tradeDatas: TradeRecord[]) => Promise<void>

  /**
   * 取引履歴取得
   *
   * @remarks
   *
   * @param ids 欲しい履歴
   * @returns 引数あり - 指定されたidの履歴
   * @returns 引数なし - 全履歴
   */
  select: <T extends SelectFilterOptions>(
    options: T
  ) => T extends { mode: 'raw' }
    ? Promise<TradeRecordRaw[]>
    : Promise<TradeRecordPnL[]>

  /**
   * 履歴の変更
   *
   * @param tradeData 変更したデータ
   * @returns
   */
  update: (trades: TradeRecord[]) => Promise<void>

  /**
   * 履歴の削除
   *
   * @param ids 削除したい履歴のid
   * @returns
   */
  delete: (ids: string[]) => Promise<void>
  /**
   *
   * @param syncObj
   * @returns
   */
  sync: (syncObj: TradeSyncContextType) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
    crudAPI: ICrudAPI
  }
}

