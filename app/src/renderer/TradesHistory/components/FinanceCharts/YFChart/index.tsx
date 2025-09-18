// import * as echarts from "echarts";
// import { useEffect, useRef } from "react";

// import { useFocusedTrades } from "renderer/TradesHistory/FocusedTradesContext";

// import {
//   initialEchartsOption,
//   series,
//   series0,
//   separatorLine,
//   xAxis,
//   xAxis0,
//   xAxis1,
// } from "./eChartsOption";
// import { getProperYFOptions } from "./getProperYFOptions";
// import { toEChartsData } from "./toEChartsData";
// import type { YFChartObject, YFInterval } from "src/types/yfTypes";
// import yahooFinance from "yahoo-finance2";
// import normalizeChartToYFObjects from "./normalizeChartToYFObjects";
// import type { ChartOptions } from "node_modules/yahoo-finance2/dist/esm/src/modules/chart";
// //import { YFOptions } from '../../../../types/yfTypes'

// /**
//  * 株のチャート
//  */
// export const YFChart = ({ interval }: { interval: YFInterval }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const selectedTrades = useFocusedTrades().selectedTrades;
//   let myCharts: echarts.ECharts;

//   useEffect(() => {
//     if (!selectedTrades?.length || !chartRef) return;

//     const period1 = new Date(selectedTrades[0].date);
//     const period2 =
//       selectedTrades.length > 1
//         ? new Date(selectedTrades[selectedTrades.length - 1].date)
//         : new Date(
//             period1.getFullYear(),
//             period1.getMonth(),
//             period1.getDate() + 1
//           );

//     const symbol = `${selectedTrades[0].symbol}${selectedTrades[0].placeYF}`;
//     const options: ChartOptions = getProperYFOptions({
//       interval,
//       period1,
//       period2,
//     });
//     options.return = "array";
//     yahooFinance
//       .chart(symbol, options as ChartOptions)
//       .then((chart) => chart.quotes as YFChartObject[])
//       .then((data) => {
//         myCharts = echarts.init(chartRef.current);
//         const eChartsData = toEChartsData(data, selectedTrades, interval);
//         myCharts?.setOption(
//           {
//             ...initialEchartsOption,
//             xAxis: [
//               {
//                 ...xAxis,
//                 data: eChartsData.xAxisData,
//               },
//               {
//                 ...xAxis0,
//                 axisLabel: {
//                   ...xAxis0.axisLabel,
//                   interval: ![
//                     "1d",
//                     "5d",
//                     "1wk",
//                     "1mo",
//                     "3mo",
//                     undefined,
//                   ].includes(interval)
//                     ? "auto"
//                     : xAxis0.axisLabel.interval,
//                 },
//                 data: eChartsData.xAxisData0,
//               },
//               {
//                 ...xAxis1,
//                 data: eChartsData.xAxisData1,
//               },
//               {
//                 ...xAxis,
//                 data: eChartsData.xAxisData2,
//               },
//             ],
//             series: [
//               {
//                 ...series,
//                 data: eChartsData.yAxisData,
//               },
//               {
//                 ...series,
//                 xAxisIndex: 0,
//                 markArea: {
//                   itemStyle: {
//                     color: "rgba(100,100,200,0.2)",
//                   },
//                   data: [
//                     [...eChartsData.buyLineData, ...eChartsData.sellLineData],
//                   ],
//                 },
//               },
//               {
//                 ...series0,
//                 xAxisIndex: 3,
//                 markLine: {
//                   ...separatorLine,
//                   data: eChartsData.xAxisData2
//                     .filter((value) => value != 0)
//                     .map((value) => {
//                       return { xAxis: value.toString() };
//                     }),
//                 },
//               },
//             ],
//           },
//           true
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [selectedTrades, interval]);

//   window.addEventListener("resize", () => {
//     if (myCharts && chartRef) {
//       myCharts.resize();
//     }
//   });

//   return (
//     <div
//       ref={chartRef}
//       style={{ width: "calc(100vw - 300px)", height: "calc(100vh - 210px)" }}
//     ></div>
//   );
// };
