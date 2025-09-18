import type { YFChartObject } from "src/types/yfTypes";

// ▼ どちらの形でも受け止められる「ゆるい型」
type ChartLike = {
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: (number | null)[];
      high?: (number | null)[];
      low?: (number | null)[];
      close?: (number | null)[];
      volume?: (number | null)[];
    }>;
  };
  quotes?: Array<{
    date: Date | number | string;
    open?: number | null;
    high?: number | null;
    low?: number | null;
    close?: number | null;
    volume?: number | null;
  }>;
  meta?: unknown;
  events?: unknown;
};

function isQuotesArrayShape(x: any): x is { quotes: NonNullable<ChartLike['quotes']> } {
  return Array.isArray(x?.quotes);
}

function isTimestampIndicatorsShape(
  x: any
): x is { timestamp: number[]; indicators: NonNullable<ChartLike['indicators']> } {
  return Array.isArray(x?.timestamp) && Array.isArray(x?.indicators?.quote);
}

// 返り値を YFChartObject[] に正規化
export default function normalizeChartToYFObjects(res: any): YFChartObject[] {
  const chart = res as ChartLike;

  // パターンA: quotes[] 形式
  if (isQuotesArrayShape(chart)) {
    return chart.quotes!
      .map((q) => ({
        date:
          q.date instanceof Date
            ? q.date
            : new Date(typeof q.date === 'number' ? q.date : Date.parse(q.date)),
        open: q.open ?? undefined,
        high: q.high ?? undefined,
        low: q.low ?? undefined,
        close: q.close ?? undefined,
        volume: q.volume ?? undefined,
      }))
      .filter((d): d is YFChartObject =>
        d.date instanceof Date &&
        d.open != null &&
        d.high != null &&
        d.low != null &&
        d.close != null &&
        d.volume != null
      );
  }

  // パターンB: timestamp + indicators.quote[0] 形式
  if (isTimestampIndicatorsShape(chart)) {
    const ts = chart.timestamp ?? [];
    const q0 = chart.indicators?.quote?.[0];
    if (!q0) return [];

    const opens = q0.open ?? [];
    const highs = q0.high ?? [];
    const lows  = q0.low ?? [];
    const closes= q0.close ?? [];
    const vols  = q0.volume ?? [];

    return ts
      .map((t, i) => ({
        date: new Date(t * 1000), // timestamp は秒
        open: opens[i] ?? undefined,
        high: highs[i] ?? undefined,
        low:  lows[i]  ?? undefined,
        close:closes[i]?? undefined,
        volume: vols[i]?? undefined,
      }))
      .filter((d): d is YFChartObject =>
        d.open != null && d.high != null && d.low != null && d.close != null && d.volume != null
      );
  }

  // 想定外の形は空配列に
  return [];
}
