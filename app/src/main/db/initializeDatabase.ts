import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('./stock.db')

import { brandProfilesSql, businessTypeSql, marketPlacesSql } from './sql'

const tradeTables = [
  {
    name: 'trades',
    query: `CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      symbol TEXT NOT NULL, -- 銘柄コード 7203
      trade_type TEXT NOT NULL, -- 現物買,信用新規買...
      hold_type TEXT NOT NULL, -- 一般, 特定, NISA
      quantity INTEGER NOT NULL, -- 購入数量
      rest_quantity INTEGER NOT NULL, -- 新規の場合 : 残り所有量
      price REAL NOT NULL,
      fee REAL NOT NULL,
      tax REAL NOT NULL
    )`,
  },
  {
    name: 'trade_links',
    query: `CREATE TABLE IF NOT EXISTS trade_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      new_trade_id TEXT NOT NULL, -- 新規取引
      repay_trade_id TEXT NOT NULL, -- 返済取引
      trade_quantity INTEGER NOT NULL -- 取引数量
    )`,
  },
]

tradeTables.forEach(({ name, query }) => {
  db.run(query, (err) => {
    if (err) {
      console.error(`Error creating ${name} table:`, err)
    } else {
      console.log(`Done creating ${name} table`)
    }
  })
})

const baseTables = [
  {
    name: 'market_places',
    create: `CREATE TABLE IF NOT EXISTS market_places (
      id INTEGER PRIMARY KEY,
      place TEXT, -- 取引所名
      place_y_f TEXT, -- .T のようなyahoofinanceに対応した取引所名
      market TEXT
    )`,
    insert: marketPlacesSql,
  },
  {
    name: 'business_type_33',
    create: `CREATE TABLE IF NOT EXISTS business_type_33 (
      id TEXT PRIMARY KEY, -- 業種コード
      type TEXT -- 業種名
    )`,
    insert: businessTypeSql,
  },
  {
    name: 'brand_profiles',
    create: `CREATE TABLE IF NOT EXISTS brand_profiles (
      id TEXT PRIMARY KEY, -- 銘柄コード
      company TEXT,
      market_id INTEGER, -- market_placesの外部キー
      business_id TEXT, -- business_type_33の外部キー
      FOREIGN KEY (market_id) REFERENCES market_places(id),
      FOREIGN KEY (business_id) REFERENCES business_type_33(id)
    )`,
    insert: brandProfilesSql,
  },
]

baseTables.forEach(({ name, create, insert }) => {
  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${name}';`,
    (err, row) => {
      if (err) {
        console.error(`Error checking ${name} table existence:`, err)
      } else if (row) {
        console.log(`Table '${name}' exists.`)
      } else {
        console.log(`Table '${name}' does not exist.`)
        db.run(create, (createErr) => {
          if (createErr)
            return console.log(`Error creating ${name} table:`, createErr)
          db.run(insert)
        })
      }
    }
  )
})

export { db }
