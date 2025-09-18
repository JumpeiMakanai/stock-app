import { useEffect, useMemo, useState } from "react";

import { OtherCharts } from "./components/OtherCharts";
import { PnLChart } from "./components/PnLCharts";
import { PnLHeader } from "./components/PnLHeader";
import { PnLList } from "./components/PnLList";
import { PnLSummary } from "./components/PnLSummary";
import {
  EChartsOptionProvider,
  useEChartsOption,
  useEChartsOptionDispatch,
} from "./EChartsOptionContext";
import { aggregateTradePnL } from "./hooks/aggregateTradePnL";
import { findIntervalPnLByDate } from "./hooks/findIntervalPnLByDate";
import { getPnL } from "./hooks/getPnL";
//import { PnLProvider } from './PnLContext'
import "./index.css";
import type { TradeRecordPnL } from "src/types/PnLType";

export const GainAndLoss = () => {
  return (
    <>
      <EChartsOptionProvider>
        <GainAndLossChild />
      </EChartsOptionProvider>
    </>
  );
};

const GainAndLossChild = () => {
  const [showList, setShowList] = useState(false);
  const [tradePnLs, setTradePnLs] = useState<TradeRecordPnL[]>([]);
  const eChartsOption = useEChartsOption();
  const eChartsDispatch = useEChartsOptionDispatch();

  useEffect(() => {
    fetch("http://localhost:4010/trades/select/pnl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filterOptions: { mode: "PnL" } }),
    })
      .then(async (res) => {
        if (!res.ok) {
          // レスポンスがエラーの場合
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((trades: TradeRecordPnL[]) => {
        setTradePnLs(trades);
        if (trades.length) {
          eChartsDispatch &&
            eChartsDispatch({
              type: "setDate",
              date: new Date(trades[trades.length - 1].date),
            });
        }
      })
      .catch((e) => console.log(e));
  }, []);

  const toggleShowList = () => {
    setShowList(!showList);
  };

  /** 選択された間隔とその間隔に合わせた期間でまとめた損益 */
  const groupedByPeriodPnL = useMemo(
    () =>
      eChartsOption ? aggregateTradePnL(eChartsOption.interval, tradePnLs) : [],
    [tradePnLs, eChartsOption?.interval]
  );

  /** 選択された日を含んでいる機関の損益 */
  const getSelectedTradePnLs = (): TradeRecordPnL[][] => {
    if (!tradePnLs || !eChartsOption) return [];
    return findIntervalPnLByDate(
      groupedByPeriodPnL,
      eChartsOption.date,
      eChartsOption.interval
    );
  };

  const { selectedTradePnLs, periodPnL, periodPnLPlus, periodPnLMinus } =
    useMemo(() => {
      const stp = getSelectedTradePnLs();
      let periodPnLPlus = 0;
      let periodPnLMinus = 0;
      for (let i = 0; i < stp.length; i++) {
        for (let j = 0; j < stp[i].length; j++) {
          const pnl = getPnL(stp[i][j]);
          if (pnl < 0) periodPnLMinus += pnl;
          else periodPnLPlus += pnl;
        }
      }
      return {
        selectedTradePnLs: stp,
        periodPnL: periodPnLPlus + periodPnLMinus,
        periodPnLPlus,
        periodPnLMinus,
      };
    }, [tradePnLs, eChartsOption]);

  const { totalPnL, totalPnLPlus, totalPnLMinus } = useMemo(() => {
    let totalPnLPlus = 0;
    let totalPnLMinus = 0;
    for (let i = 0; i < tradePnLs.length; i++) {
      const pnl = getPnL(tradePnLs[i]);
      if (pnl < 0) totalPnLMinus += pnl;
      else totalPnLPlus += pnl;
    }
    return {
      totalPnL: totalPnLPlus + totalPnLMinus,
      totalPnLPlus,
      totalPnLMinus,
    };
  }, [tradePnLs]);

  return (
    <>
      <PnLHeader toggle={toggleShowList} />
      <div
        className={`pnl-list-container ${showList ? "pnl-list-container-show" : "pnl-list-container-hidden"}`}
      >
        <PnLList tradePnLs={selectedTradePnLs} />
      </div>
      <div style={{ display: "flex" }}>
        <PnLSummary
          totalPnL={totalPnL}
          totalPnLPlus={totalPnLPlus}
          totalPnLMinus={totalPnLMinus}
          periodPnL={periodPnL}
          periodPnLPlus={periodPnLPlus}
          periodPnLMinus={periodPnLMinus}
        />
        <OtherCharts tradePnLs={selectedTradePnLs} />
      </div>
      <PnLChart groupedByPeriodPnL={groupedByPeriodPnL}></PnLChart>
    </>
  );
};
