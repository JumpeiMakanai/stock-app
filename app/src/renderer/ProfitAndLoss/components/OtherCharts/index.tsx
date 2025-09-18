import * as echarts from "echarts";
import { toBusinessTypePie } from "./datas/businessTypePie";
import { toLongShortPie } from "./datas/longShortPie";
import { toTimeAndPnLScatterData } from "./datas/timeAndPnL";
import { Piee } from "./Pie";
import { Scatter } from "./Scatter";
import { useEffect, useRef } from "react";
import type { TradeRecordPnL } from "src/types/PnLType";

export const OtherCharts = ({
  tradePnLs,
}: {
  tradePnLs: TradeRecordPnL[][];
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const longTrades = tradePnLs
    .flatMap((t) => t)
    .filter(
      (trade) => trade.tradeType == "現物売" || trade.tradeType == "信用返済売"
    );

  const shortTrades = tradePnLs
    .flatMap((t) => t)
    .filter((trade) => trade.tradeType == "信用返済買");
  useEffect(() => {
    if (!chartRef.current) return;
    echarts.dispose(chartRef.current);

    const chart = echarts.init(chartRef.current);
    // ...existing code for setting chart options...
    return () => {
      chart.dispose();
    };
  }, [tradePnLs /*, 他の依存 */]);

  return (
    <div className="other-container other-size-height">
      <Piee data={toBusinessTypePie(tradePnLs)} />
      <Piee data={toLongShortPie(tradePnLs)} suffix="円" />
      <>
        {/* {!!longTrades.length && ( */}
        <Scatter
          data={toTimeAndPnLScatterData(longTrades)}
          title="時間と損益の関係 ロング"
          color={["#f55"]}
        />
        {/* )} */}
        {/* {!!shortTrades.length && ( */}
        <Scatter
          data={toTimeAndPnLScatterData(shortTrades)}
          title="時間と損益の関係 ショート"
          color={["#55f"]}
        />
        {/* )} */}
      </>
    </div>
  );
};
