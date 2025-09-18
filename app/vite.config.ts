import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 参考: https://zenn.dev/haruotsu/articles/82e01ee48cc766
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Electron 時代の import 'renderer/...' を解決
      renderer: path.resolve(__dirname, 'src/renderer'),
      // ついでに 'src/...' も使えるように
      src: path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: 'localhost', // WSL環境でもWindows側のブラウザから接続可能に
    port: 5173, // デフォルトポート（変更可能）
    strictPort: true, // ポートが使用中ならエラー
    watch: {
      usePolling: true // WSLでのファイル変更検出を安定化
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173,
    }
  }
});