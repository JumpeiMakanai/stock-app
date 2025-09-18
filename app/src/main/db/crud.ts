/**
 *
 */
import { TradeSyncContextType } from 'renderer/TradesHistory/TradeSyncContext'
import { TradeDBError } from 'types/TradeError'

import { isEntryTradeType, objectToSnakeCase, turnedTradeType } from './dbHooks'
import { db } from './initializeDatabase'

const executeSelectQuery = (
  sql: string,
  params: any[] = []
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err.message)
      resolve(rows)
    })
  })
}

const executeNonQuery = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) return reject(err.message)
      resolve()
    })
  })
}

const _insert = async (trades: TradeRecordDB[]): Promise<void> => {
  const insertSql = `INSERT INTO trades VALUES ${trades.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',')}`
  const insertData = trades.flatMap((trade) => [
    trade.id,
    trade.date,
    trade.symbol,
    trade.trade_type,
    trade.hold_type,
    trade.quantity,
    trade.quantity,
    trade.price,
    trade.fee,
    trade.tax,
  ])

  await executeNonQuery(insertSql, insertData)
}

export class CRUD {
  static async insert(trades: TradeRecordDB[]): Promise<any> {
    try {
      await executeNonQuery('BEGIN TRANSACTION')

      //
      const entryTrades = trades.filter((data) =>
        isEntryTradeType(data.trade_type)
      )
      if (entryTrades.length) await _insert(entryTrades)

      //
      const repayTrades = trades
        .filter((data) => !isEntryTradeType(data.trade_type))
        .sort((trade1, trade2) => trade1.date - trade2.date)

      if (!repayTrades.length) return executeNonQuery('COMMIT')

      const entryTradesql = `
        SELECT * FROM trades 
        WHERE date <= ? AND symbol = ? AND trade_type = ? AND rest_quantity > 0 
        ORDER BY date ASC
      `

      for (const repayTrade of repayTrades) {
        const rows: TradeRecordDB[] = await executeSelectQuery(entryTradesql, [
          repayTrade.date,
          repayTrade.symbol,
          turnedTradeType(repayTrade.trade_type),
        ])

        if (repayTrade.symbol == '7013') {
          console.log(repayTrade)
          console.log(rows)
        }

        let repayQuant = repayTrade.quantity
        const tradesToUpdate: TradeRecordDB[] = []
        const linksParams: (string | number)[] = []

        for (const row of rows) {
          if (repayQuant === 0) break

          let rowRestQuantity = row.rest_quantity

          if (rowRestQuantity >= repayQuant) {
            rowRestQuantity -= repayQuant
            repayQuant = 0
          } else {
            repayQuant -= rowRestQuantity
            rowRestQuantity = 0
          }

          tradesToUpdate.push({
            ...row,
            rest_quantity: rowRestQuantity,
          })

          linksParams.push(
            row.id,
            repayTrade.id,
            row.rest_quantity - rowRestQuantity
          )
        }

        if (repayQuant) {
          console.log(rows)
          throw new TradeDBError(repayTrade.id, '取引数量が合っていません')
        }

        await CRUD.update(tradesToUpdate, ['rest_quantity'])

        // trade_links
        const insertLinksSql = `INSERT INTO trade_links (new_trade_id, repay_trade_id, trade_quantity) VALUES ${tradesToUpdate.map(() => '(?,?,?)').join(',')}`

        executeNonQuery(insertLinksSql, linksParams)

        await _insert([repayTrade])
      }
      await executeNonQuery('COMMIT')
    } catch (err) {
      await executeNonQuery('ROLLBACK')
      if (err instanceof TradeDBError) return { failId: err.failId }
      throw err
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  static async select(options: SelectFilterOptions): Promise<any[]> {
    let sql = ''
    const params: any[] = []

    if (options.mode == 'raw') {
      sql = `SELECT 
      t.id, t.date, t.symbol, bp.company, t.trade_type, t.hold_type, t.quantity, t.rest_quantity, t.price, t.fee, t.tax, mp.place, mp.place_y_f, mp.market, bt.id as business_type_code, bt.type as business_type_name
      FROM trades AS t `
    } else {
      sql = `SELECT 
      t.id, t.date, nt.date as date0, t.symbol, bp.company, t.trade_type, tl.trade_quantity as quantity, 
      t.fee, t.tax, mp.place, mp.place_y_f, mp.market, bt.id as business_type_code, bt.type as business_type_name, t.price as repayTradePrice, nt.price as newTradePrice
      FROM (select * from trades WHERE trade_type IN (?, ?, ?)) as t
      LEFT JOIN trade_links AS tl ON t.id = tl.repay_trade_id
      LEFT JOIN trades AS nt ON tl.new_trade_id = nt.id `
      params.push('現物売', '信用返済買', '信用返済売')
    }

    sql += ` LEFT JOIN brand_profiles AS bp ON t.symbol = bp.id
    LEFT JOIN market_places AS mp ON bp.market_id = mp.id
    LEFT JOIN business_type_33 AS bt ON bp.business_id = bt.id
    WHERE 1=1 ` // 1=1について https://qiita.com/seiya2130/items/a34f5492592b103e2545

    if (options.id) {
      if (options.mode == 'raw') {
        sql += ` AND (t.id = ? OR
          t.id IN (SELECT tl.new_trade_id FROM trade_links AS tl WHERE tl.repay_trade_id = ?) OR 
          t.id IN (SELECT tl.repay_trade_id FROM trade_links AS tl WHERE tl.new_trade_id = ?))`
        params.push(options.id, options.id, options.id)
      } else {
        sql += ` AND t.id = ?`
        params.push(options.id)
      }
    } else {
      if (options.filter?.period1) {
        sql += ` AND t.date >= ?`
        params.push(options.filter?.period1)
      }
      if (options.filter?.period2) {
        sql += ` AND t.date <= ?`
        params.push(options.filter?.period2)
      }

      if (options.filter?.symbol) {
        sql += ` AND t.symbol = ?`
        params.push(options.filter?.symbol)
      }

      if (options.filter?.tradeType) {
        sql += ` AND t.trade_type = ?`
        params.push(options.filter?.tradeType)
      }

      if (options.filter?.holdType) {
        sql += ` AND t.hold_type = ?`
        params.push(options.filter?.holdType)
      }

      if (options.filter?.price) {
        if (options.filter?.price.Lowest) {
          sql += ` AND t.price >= ?`
          params.push(options.filter?.price.Lowest)
        }
        if (options.filter?.price.Highest) {
          sql += ` AND t.price <= ?`
          params.push(options.filter?.price.Highest)
        }
      }

      if (options.filter?.place) {
        sql += ` AND mp.place = ?`
        params.push(options.filter?.place)
      }

      if (options.filter?.businessCode) {
        sql += ` AND bp.business_id = ?`
        params.push(options.filter?.businessCode)
      }
    }

    sql += ` ORDER BY t.date ${options.order ? options.order : 'ASC'} ${options.limit ? `LIMIT ${options.limit}` : ''}`

    return await executeSelectQuery(sql, params)
  }

  static async update(
    trades: TradeRecordDB[],
    updateFields: [trade_data_key, ...trade_data_key[]] = [
      'date',
      'symbol',
      'trade_type',
      'hold_type',
      'quantity',
      'rest_quantity',
      'price',
      'fee',
      'tax',
    ]
  ): Promise<void> {
    if (!trades.length) return

    const params: any[] = []

    const updateCaseClause = (field: trade_data_key) => {
      return `${field} = CASE id ${trades
        .map((trade) => {
          params.push(trade.id, trade[field])
          return ` WHEN ? THEN ? `
        })
        .join(' ')} END`
    }

    const placeholders = updateFields.map(updateCaseClause).join(',')
    const updateSql = `UPDATE trades SET ${placeholders} WHERE id IN (${trades.map(() => '?').join(',')})`

    params.push(...trades.map((trade) => trade.id))

    await executeNonQuery(updateSql, params)
  }

  static async delete(ids: string[]): Promise<void> {
    const placeholders = ids.map(() => '?').join(',')
    const deleteSql = `DELETE FROM trades WHERE id IN (${placeholders})`
    await executeNonQuery(deleteSql, ids)
  }

  static async sync(tradeSyncRecords: TradeSyncContextType): Promise<void> {
    try {
      console.log('begin')
      await executeNonQuery('BEGIN TRANSACTION')
      if (!tradeSyncRecords.orgTrades.length)
        throw new Error('更新データがありません。')
      const modifiedTradesArray = tradeSyncRecords.modifiedTrades
        .flatMap((trades) => {
          if (!trades.length) return []
          const firstTrade = { ...trades[0] }
          const digit = 100
          for (let i = 1; i < trades.length; i++) {
            firstTrade.price =
              (firstTrade.price * firstTrade.quantity * digit +
                trades[i].price * trades[i].quantity * digit) /
              (firstTrade.quantity + trades[i].quantity)
            firstTrade.price = Math.floor(firstTrade.price / digit)
            firstTrade.quantity += trades[i].quantity
            firstTrade.fee += trades[i].fee
            firstTrade.tax += trades[i].tax
          }
          return [firstTrade]
        })
        .map((trade) => objectToSnakeCase(trade))

      const modifiedOrgTrades = modifiedTradesArray.filter((trade) =>
        tradeSyncRecords.orgTrades.map(({ id }) => id).includes(trade.id)
      )
      const deletedTrades: TradeRecordDB[] = tradeSyncRecords.orgTrades
        .filter(({ id }) => tradeSyncRecords.deleteIds.includes(id))
        .map((trade) => objectToSnakeCase(trade))
      const modifiedNewTrades = modifiedTradesArray.filter(
        (trade) =>
          !tradeSyncRecords.orgTrades.map(({ id }) => id).includes(trade.id)
      )

      type RestQuantUnpaidMapType = {
        id: string
        restQuant: number
      }
      let restQuantUnpaidMap: RestQuantUnpaidMapType[] = []

      console.log('start newEntryTrade insert')
      // あたらしい新規取引
      const newEntryTrades = modifiedNewTrades.filter((trade) =>
        isEntryTradeType(trade.trade_type)
      )
      if (newEntryTrades.length) await _insert(newEntryTrades)
      console.log('done newTrade insert')

      console.log('start orgEntryTrade delete')
      // オリジナルの中の消去される新規取引
      const deletedEntryTrades = deletedTrades.filter((trade) =>
        isEntryTradeType(trade.trade_type)
      )
      for (const trade of deletedEntryTrades) {
        const tradeLinksRows: any[] = await executeSelectQuery(
          'select * from trade_links where new_trade_id = ?',
          [trade.id]
        )

        if (tradeLinksRows.length) {
          for (const row of tradeLinksRows) {
            // 未返済となった取引
            restQuantUnpaidMap.push({
              id: row.repay_trade_id,
              restQuant: row.trade_quantity,
            })
            // リンクを消去
            await executeNonQuery(
              `DELETE FROM trade_links WHERE new_trade_id = ? and repay_trade_id = ?`,
              [row.id, trade.id]
            )
          }
        }
      }
      // 新規取引を消去
      await this.delete(deletedEntryTrades.map((trade) => trade.id))
      console.log('donw orgEntryTrade delete', restQuantUnpaidMap)

      console.log('start orgEntryTrade update', restQuantUnpaidMap)
      // オリジナルの中の変更する新規取引
      const orgEntryTrades = modifiedOrgTrades.filter(
        (trade) =>
          !tradeSyncRecords.deleteIds.includes(trade.id) &&
          isEntryTradeType(trade.trade_type)
      )
      for (const newOrgTrade of orgEntryTrades) {
        const [oldOrgTrade]: TradeRecordDB[] = tradeSyncRecords.orgTrades
          .filter((trade) =>
            orgEntryTrades.map(({ id }) => id).includes(trade.id)
          )
          .map((trade) => objectToSnakeCase(trade))
        if (oldOrgTrade) {
          // トレードタイプが変わらなければ
          if (oldOrgTrade.trade_type === newOrgTrade.trade_type) {
            const diffQuant = newOrgTrade.quantity - oldOrgTrade.quantity
            let unpaid = oldOrgTrade.rest_quantity + diffQuant
            console.log(
              newOrgTrade.quantity,
              oldOrgTrade.quantity,
              newOrgTrade.rest_quantity
            )
            console.log(unpaid, 'unpaid')
            if (unpaid >= 0) {
              // 取引株数の減りよりも、所有証券の方が多い
              await this.update([
                {
                  ...newOrgTrade,
                  rest_quantity: unpaid,
                },
              ])
            } else {
              unpaid = Math.abs(unpaid)
              // 所有証券の方がすくない
              // 所有証券を0にして
              await this.update([
                {
                  ...newOrgTrade,
                  rest_quantity: 0,
                },
              ])
              // 返済取引のリンクから足りない分を補う
              // リンクされている返済取引 (最新のものから降順)
              const linkedRepayTrades: any[] = await executeSelectQuery(
                `SELECT tl.repay_trade_id, tl.new_trade_id, tl.trade_quantity
                 FROM trades AS t
                 INNER JOIN trade_links AS tl ON t.id = tl.repay_trade_id
                 WHERE tl.new_trade_id = ?
                 ORDER BY t.date DESC;`,
                [newOrgTrade.id]
              )
              innerLoop: for (const {
                repay_trade_id,
                new_trade_id,
                trade_quantity,
              } of linkedRepayTrades) {
                if (unpaid === 0) break innerLoop
                console.log(unpaid)
                // 取引数量の方が未返済よりも多い
                if (trade_quantity >= unpaid) {
                  // 未返済マップに挿入
                  restQuantUnpaidMap.push({
                    id: repay_trade_id,
                    restQuant: unpaid,
                  })
                  // 未返済分を取引数量から引く
                  await executeNonQuery(
                    `update trade_links
                    set trade_quantity = ?
                    where new_trade_id = ? and repay_trade_id = ?`,
                    [trade_quantity - unpaid, new_trade_id, repay_trade_id]
                  )
                  break innerLoop
                  // 未返済の方が多い
                } else {
                  // リンクを消去
                  await executeNonQuery(
                    `DELETE FROM trade_links WHERE new_trade_id = ? and repay_trade_id = ?`,
                    [new_trade_id, repay_trade_id]
                  )
                  restQuantUnpaidMap.push({
                    id: repay_trade_id,
                    restQuant: trade_quantity,
                  })
                  unpaid -= trade_quantity
                }
              }
            }
            // トレードタイプが変わっていたら
            // 新しい取引として挿入後
            // 未返済取引の取得と、リンクの消去
          } else {
            await this.update([
              { ...newOrgTrade, rest_quantity: newOrgTrade.quantity },
            ])
            console.log('diff type')
            // 返済取引に変更されていた場合、未返済として登録
            if (!isEntryTradeType(newOrgTrade.trade_type))
              restQuantUnpaidMap.push({
                id: newOrgTrade.id,
                restQuant: newOrgTrade.quantity,
              })

            const linkdeRepayTrades = await executeSelectQuery(
              'select * from trade_links where new_trade_id = ?',
              [newOrgTrade.id]
            )

            if (linkdeRepayTrades.length) {
              for (const {
                repay_trade_id,
                trade_quantity,
              } of linkdeRepayTrades) {
                restQuantUnpaidMap.push({
                  id: repay_trade_id,
                  restQuant: trade_quantity,
                })
              }

              // 新規取引のリンクをすべて消去
              await executeNonQuery(
                `DELETE FROM trade_links WHERE new_trade_id = ?`,
                [newOrgTrade.id]
              )
            }
          }
        }
      }
      console.log('donw orgEntryTrade update', restQuantUnpaidMap)

      console.log('start orgRepayTrade delete')
      // オリジナルの中の消去される返済取引
      const deletedRepayTrades = deletedTrades.filter(
        (trade) => !isEntryTradeType(trade.trade_type)
      )
      // 未返済マップないからも消去
      restQuantUnpaidMap = restQuantUnpaidMap.filter(
        ({ id }) => !tradeSyncRecords.deleteIds.includes(id)
      )
      for (const trade of deletedRepayTrades) {
        const tradeLinksRows: any[] = await executeSelectQuery(
          'select * from trade_links where repay_trade_id = ?',
          [trade.id]
        )

        if (tradeLinksRows.length) {
          for (const row of tradeLinksRows) {
            // 新規取引を更新
            await executeNonQuery(
              `UPDATE trades
             SET rest_quantity = rest_quantity + (
                SELECT trade_quantity
                FROM trade_links
                WHERE new_trade_id = ? AND repay_trade_id = ?
             )
             WHERE id = ?;`,
              [row.new_trade_id, trade.id, row.new_trade_id]
            )
            const aaa = await executeSelectQuery(
              'select * from trade_links where repay_trade_id = ?',
              [trade.id]
            )
            const bbb = await executeSelectQuery(
              `select * from trades where id = ?`,
              [row.new_trade_id]
            )
            console.log(aaa)
            console.log(bbb)
            // リンクを消去
            await executeNonQuery(
              `DELETE FROM trade_links WHERE new_trade_id = ? and repay_trade_id = ?`,
              [row.new_trade_id, trade.id]
            )
          }
        }
      }
      // 返済取引を消去
      await this.delete(deletedRepayTrades.map((trade) => trade.id))
      console.log('done orgRepayTrade delete')

      console.log('start orgRepayTrade update', restQuantUnpaidMap)
      // オリジナルの中の変更する返済取引
      const orgRepayTrades = modifiedOrgTrades.filter(
        (trade) =>
          !tradeSyncRecords.deleteIds.includes(trade.id) &&
          !isEntryTradeType(trade.trade_type)
      )
      for (const newOrgTrade of orgRepayTrades) {
        const [oldOrgTrade]: TradeRecordDB[] = tradeSyncRecords.orgTrades
          .filter((trade) =>
            orgRepayTrades.map(({ id }) => id).includes(trade.id)
          )
          .map((trade) => objectToSnakeCase(trade))
        if (oldOrgTrade) {
          // トレードタイプが変わらなければ
          if (oldOrgTrade.trade_type === newOrgTrade.trade_type) {
            let diffQuant = newOrgTrade.quantity - oldOrgTrade.quantity

            console.log('1', diffQuant)
            // リンクしている新規が既に消去されている場合
            // 未返済か確認
            let isInUnpaid = false
            for (let i = 0; i < restQuantUnpaidMap.length; i++) {
              if (restQuantUnpaidMap[i].id == newOrgTrade.id) {
                // 未返済株が残ってしまった場合
                if (restQuantUnpaidMap[i].restQuant + diffQuant > 0) {
                  restQuantUnpaidMap[i].restQuant += diffQuant
                  diffQuant = 0
                  // 返済株数の減りが未返済を上回っている場合
                } else {
                  diffQuant += restQuantUnpaidMap[i].restQuant
                  restQuantUnpaidMap = restQuantUnpaidMap.filter(
                    ({ id }) => id !== newOrgTrade.id
                  )
                }
                isInUnpaid = true
              }
            }

            console.log('2', diffQuant)
            // 返済数が減っていないかつ未返済にない場合
            if (!isInUnpaid && diffQuant > 0) {
              restQuantUnpaidMap.push({
                id: newOrgTrade.id,
                restQuant: diffQuant,
              })
              // 未返済を上回った
              // または、未返済になく元の株数から減った
              // 修正すべき株を新規取引のrest_quantityに足していく
            } else if (diffQuant < 0) {
              diffQuant = Math.abs(diffQuant)
              // 新しいものから
              const pendingEntryTrades = await executeSelectQuery(
                `
                SELECT t.id, t.quantity, t.rest_quantity, tl.trade_quantity
                  FROM trade_links AS tl
                  INNER JOIN trades AS t ON t.id = tl.new_trade_id
                  WHERE tl.repay_trade_id = ?
                  ORDER BY t.date DESC;`,
                [newOrgTrade.id]
              )
              if (pendingEntryTrades?.length) {
                for (const pet of pendingEntryTrades) {
                  let tradeQuantity = 0
                  // 新規取引に足すべき株数がなくなった
                  if (pet.quantity - pet.rest_quantity >= diffQuant) {
                    await executeNonQuery(
                      `update trades 
                      set rest_quantity = rest_quantity + ? 
                      where id = ?`,
                      [diffQuant, pet.id]
                    )
                    tradeQuantity = pet.rest_quantity + diffQuant
                    diffQuant = 0
                    // 足すべき返済株がある
                  } else {
                    await executeNonQuery(
                      `update trades
                      set rest_quantity = quantity
                      where id = ?`,
                      [pet.id]
                    )
                    tradeQuantity = pet.quantity
                    diffQuant -= pet.quantity - pet.rest_quantity
                  }
                  // リンクの更新
                  await executeNonQuery(
                    `update trade_links
                    set trade_quantity = ?
                    where new_trade_id = ? and repay_trade_id = ?`,
                    [tradeQuantity, pet.id, newOrgTrade.id]
                  )
                }
              }

              // 元の返済株数以上に減っていたら (返済株数がマイナスの可能性あり)
              if (diffQuant) {
                throw new TradeDBError(
                  newOrgTrade.id,
                  '返済取引の変更中にエラーが発生しました。'
                )
              }
            }

            console.log('3', newOrgTrade)
            // 変更を更新
            await this.update([
              { ...newOrgTrade, rest_quantity: newOrgTrade.quantity },
            ])

            // トレードタイプが変わっていたら
            // 新しい取引として挿入後
            // 未返済取引の取得と、リンクの消去
          } else {
            await this.update([
              { ...newOrgTrade, rest_quantity: newOrgTrade.quantity },
            ])
            // 返済取引のままなら、未返済として登録
            if (!isEntryTradeType(newOrgTrade.trade_type))
              restQuantUnpaidMap.push({
                id: newOrgTrade.id,
                restQuant: newOrgTrade.quantity,
              })
            const linkedTradeIds = await executeSelectQuery(
              'select * from trade_links where repay_trade_id = ?',
              [newOrgTrade.id]
            )

            if (linkedTradeIds.length) {
              for (const { new_trade_id, trade_quantity } of linkedTradeIds) {
                await executeNonQuery(
                  `
                update trades
                set rest_quantity = rest_quantity + ?
                where new_trade_id = ?`,
                  [trade_quantity, new_trade_id]
                )
              }

              // 返済取引のリンクをすべて消去
              await executeNonQuery(
                `DELETE FROM trade_links WHERE new_trade_id = ?`,
                [newOrgTrade.id]
              )
            }
          }
        }
      }
      console.log('donw orgRepayTrade update', restQuantUnpaidMap)

      // 所有証券
      const entryTrades: TradeRecordDB[] = await executeSelectQuery(
        `SELECT * FROM trades 
          WHERE symbol = ? AND rest_quantity > 0 
          ORDER BY date ASC`,
        [tradeSyncRecords.orgTrades[0].symbol]
      )

      let sortedRestQuantUnpaidMap: (RestQuantUnpaidMapType & {
        repayTrade: TradeRecordDB
      })[] = []
      for (const rqum of restQuantUnpaidMap) {
        const [repayTrade]: TradeRecordDB[] = await executeSelectQuery(
          `select * from trades where id = ?`,
          [rqum.id]
        )
        if (!repayTrade) throw new Error('変更中にエラーが発生しました。 1')
        sortedRestQuantUnpaidMap.push({ ...rqum, repayTrade })
      }
      sortedRestQuantUnpaidMap = sortedRestQuantUnpaidMap.sort(
        ({ repayTrade: { date: dateA } }, { repayTrade: { date: dateB } }) =>
          dateA - dateB
      )

      console.log('start unpaidTrade update', restQuantUnpaidMap)
      // 未返済取引の処理
      for (const {
        id: repayId,
        restQuant,
        repayTrade,
      } of sortedRestQuantUnpaidMap) {
        let calculatedRestQuant = restQuant
        for (let i = 0; i < entryTrades.length; i++) {
          if (!calculatedRestQuant) break
          const entryTrade = entryTrades[i]
          // trade_type date の確認
          if (
            entryTrade.rest_quantity > 0 &&
            entryTrade.date <= repayTrade.date &&
            entryTrade.trade_type == turnedTradeType(repayTrade.trade_type) &&
            entryTrade.hold_type == repayTrade.hold_type
          ) {
            // 新規取引の更新
            let addQuantToLinks = 0
            if (entryTrade.rest_quantity >= calculatedRestQuant) {
              await this.update([
                {
                  ...entryTrade,
                  rest_quantity: entryTrade.rest_quantity - calculatedRestQuant,
                },
              ])

              entryTrades[i].rest_quantity -= calculatedRestQuant
              addQuantToLinks += calculatedRestQuant
              calculatedRestQuant = 0
              break
            } else {
              await this.update([{ ...entryTrade, rest_quantity: 0 }])
              calculatedRestQuant -= entryTrade.rest_quantity
              addQuantToLinks += entryTrade.rest_quantity
              entryTrades[i].rest_quantity = 0
            }
            const isExist = await executeSelectQuery(
              'select * from trade_links where new_trade_id = ? and repay_trade_id = ?',
              [entryTrade.id, repayId]
            )
            // リンクスの更新
            // リンクスにすでにある場合
            if (isExist.length) {
              // update
              await executeNonQuery(
                `update trade_links
                 set trade_quantity = trade_quantity + ?
                 where new_trade_id = ? and repay_trade_id = ?`,
                [addQuantToLinks, entryTrade.id, repayId]
              )
              // なければ
            } else {
              // insert
              await executeNonQuery(
                `INSERT INTO trade_links
                 (new_trade_id, repay_trade_id, trade_quantity) 
                 VALUES (?,?,?)`,
                [entryTrade.id, repayId, addQuantToLinks]
              )
            }
          }
        }

        console.log(calculatedRestQuant, 'calcu')
        if (calculatedRestQuant)
          throw new TradeDBError(
            repayId,
            '返済取引の更新中にエラーが発生しました。'
          )
      }
      console.log('done unpaidTrade update')

      console.log('start newRepayTrade insert')
      // あたらしい返済取引
      const newRepayTrades = modifiedNewTrades.filter(
        (trade) => !isEntryTradeType(trade.trade_type)
      )
      if (!newRepayTrades.length) return executeNonQuery('COMMIT')

      const entryTradesql = `
          SELECT * FROM trades 
          WHERE date <= ? AND symbol = ? AND trade_type = ? AND rest_quantity > 0 
          ORDER BY date ASC
        `

      for (const repayTrade of newRepayTrades) {
        const rows: TradeRecordDB[] = await executeSelectQuery(entryTradesql, [
          repayTrade.date,
          repayTrade.symbol,
          turnedTradeType(repayTrade.trade_type),
        ])

        let repayQuant = repayTrade.quantity
        const tradesToUpdate: TradeRecordDB[] = []
        const linksParams: (string | number)[] = []

        for (const row of rows) {
          if (repayQuant === 0) break

          let rowRestQuantity = row.rest_quantity

          if (rowRestQuantity >= repayQuant) {
            rowRestQuantity -= repayQuant
            repayQuant = 0
          } else {
            repayQuant -= rowRestQuantity
            rowRestQuantity = 0
          }

          tradesToUpdate.push({
            ...row,
            rest_quantity: rowRestQuantity,
          })

          linksParams.push(
            row.id,
            repayTrade.id,
            row.rest_quantity - rowRestQuantity
          )
        }

        if (repayQuant) {
          console.log(rows)
          throw new TradeDBError(repayTrade.id, '取引数量が合っていません')
        }

        await CRUD.update(tradesToUpdate, ['rest_quantity'])

        // trade_links
        const insertLinksSql = `INSERT INTO trade_links (new_trade_id, repay_trade_id, trade_quantity) VALUES ${tradesToUpdate.map(() => '(?,?,?)').join(',')}`

        executeNonQuery(insertLinksSql, linksParams)

        await _insert([repayTrade])
      }
      console.log('donw newRepayTrade insert')

      await executeNonQuery('COMMIT')
    } catch (e: any) {
      console.log(e)
      await executeNonQuery('ROLLBACK')
      throw e
    }
  }
}
