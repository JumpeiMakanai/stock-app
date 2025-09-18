import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";

import { useEChartsOption } from "../../EChartsOptionContext";

import {
  initialEchartsOption,
  series,
  series0,
  xAxis,
  xAxis0,
  xAxis1,
} from "./chart/eChartsOption";
import { toEChartsData } from "./chart/toEChartsData";
import type { EChartsDataPnL, TradeRecordPnL } from "../../../../types/PnLType";

/**
 * 損益のチャート
 */
export const PnLChart = ({
  groupedByPeriodPnL,
}: {
  groupedByPeriodPnL: TradeRecordPnL[][][];
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const eChartsOption = useEChartsOption();
  let myCharts: echarts.ECharts;

  const getOtherHeight = () => {
    let h = window.innerHeight * 0.31;
    if (h > 200) h = 200;
    else if (h < 130) h = 130;
    return h + 72;
  };

  const [otherChartsHeight, setHeight] = useState(getOtherHeight());

  useEffect(() => {
    if (!chartRef.current) return;
    // 既存インスタンスがあれば破棄
    echarts.dispose(chartRef.current);

    myCharts = echarts.init(chartRef.current);
    let eChartsData: EChartsDataPnL = {
      xAxisData: [],
      xAxisData0: [],
      xAxisData1: [],
      yAxisData: [0],
      yAxisData0: [],
    };

    if (eChartsOption)
      eChartsData = toEChartsData(
        groupedByPeriodPnL,
        eChartsOption.date,
        eChartsOption.interval
      );

    myCharts?.setOption(
      {
        ...initialEchartsOption,
        xAxis: [
          {
            ...xAxis,
            data: eChartsData.xAxisData,
          },
          {
            ...xAxis0,
            data: eChartsData.xAxisData0,
          },
          {
            ...xAxis1,
            data: eChartsData.xAxisData1,
          },
        ],
        series: [
          {
            ...series,
            data: eChartsData.yAxisData,
          },
          {
            ...series0,
            data: eChartsData.yAxisData0,
          },
        ],
      },
      true
    );
    return () => {
      myCharts.dispose();
    };
  }, [groupedByPeriodPnL, eChartsOption]);

  window.addEventListener("resize", () => {
    if (myCharts && chartRef) {
      myCharts.resize();
      setHeight(getOtherHeight());
    }
  });

  return (
    <div>
      <div
        ref={chartRef}
        style={{
          width: "100vw",
          height: `calc(100vh - ${otherChartsHeight}px)`,
        }}
      ></div>
    </div>
  );
};
