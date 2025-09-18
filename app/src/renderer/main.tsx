import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import 'normalize.css'

// 以下のように renderer プロセスで electron のモジュールを使用するとエラーが起こる
// import { ipcRenderer } from "electron";
// 解決するにはやっぱり preload を使うしかなさそう

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)