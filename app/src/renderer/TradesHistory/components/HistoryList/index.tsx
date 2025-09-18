import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { priceFormatter } from "renderer/hooks/priceFormatter";
import { BaseDatePicker } from "renderer/Parts/MyMui";
import {
  useFocusedTrades,
  useFocusedTradesDispatch,
} from "renderer/TradesHistory/FocusedTradesContext";
import {
  formatToDateDay,
  formatToTime,
} from "renderer/TradesHistory/hooks/formatToTime";
import { getHistoryTrades } from "renderer/TradesHistory/hooks/getHistoryTrades";
import { useTradeSyncDispatch } from "renderer/TradesHistory/TradeSyncContext";
import type { TradeRecord, TradeRecordRaw } from "src/types/TradeType";

const stickyStyles = {
  header: [
    {
      position: "sticky",
      left: 0,
      minWidth: 44,
      zIndex: 120,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: "",
    },
    {
      position: "sticky",
      left: 50,
      minWidth: 144,
      zIndex: 120,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 2,
      borderColor: "rgba(100,100,200,0.5)",
    },
  ],
  cell: [
    {
      position: "sticky",
      left: 0,
      minWidth: 50,
      zIndex: 0,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: "",
    },
    {
      position: "sticky",
      left: 50,
      minWidth: 50,
      zIndex: 100,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: "",
    },
    {
      position: "sticky",
      left: 100,
      minWidth: 100,
      zIndex: 100,
      borderTop: 0,
      borderBottom: 0,
      borderLeft: 0,
      borderRight: 2,
      borderColor: "rgba(100,100,200, 0.5)",
    },
  ],
};

/** 履歴リスト */
export const HistoryList = () => {
  const [displayedDate, setdisplayedDate] = useState(new Date());
  const focusedTrades = useFocusedTrades();
  const focusedTradesDispatch = useFocusedTradesDispatch();
  const tradeSyncDispatch = useTradeSyncDispatch();

  useEffect(() => {
    fetch("http://localhost:4010/trades/raw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filterOptions: { limit: 1, mode: "raw", order: "DESC" },
      }),
    })
      .then((res) => res.json())
      .then((trades: TradeRecordRaw[]) => {
        if (trades.length) {
          console.log(trades);
          setHistoryTrades(new Date(trades[0].date));
          selectTrade(trades[0].id);
        }
      });
  }, []);

  /**
   * 履歴のリストをセットする
   * @param date 表示する年月
   */
  const setHistoryTrades = (date: Date) => {
    setdisplayedDate(date);
    getHistoryTrades(date)
      .then((trades) => {
        console.log("setted history", trades);
        focusedTradesDispatch &&
          focusedTradesDispatch({ type: "setHistory", trades, date });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * 選択された取引に紐づいている全取引を取得
   * @param tradeId 選択された取引id
   */
  const selectTrade = (tradeId: string) => {
    fetch("http://localhost:4010/trades/raw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filterOptions: { mode: "raw", id: tradeId } }),
    })
      .then((res) => res.json())
      .then((trades: TradeRecordRaw[]) => {
        if (trades.length) {
          console.log("selected trades", trades);

          focusedTradesDispatch &&
            focusedTradesDispatch({ type: "select", trades, id: tradeId });

          console.log("useeffect editsheet");
          if (!trades) return;
          const tradeRecord: TradeRecord[] = [];
          for (const trade of trades) {
            tradeRecord.push({
              id: trade.id,
              date: new Date(trade.date).getTime(),
              symbol: trade.symbol,
              tradeType: trade.tradeType,
              holdType: trade.holdType,
              quantity: trade.quantity,
              restQuantity: trade.restQuantity,
              price: trade.price,
              fee: trade.fee,
              tax: trade.tax,
            });
          }
          console.log(tradeRecord);
          tradeSyncDispatch &&
            tradeSyncDispatch({ type: "initialize", trades: tradeRecord });
        }
      });
  };

  const listBackroundColor = (id: string) => {
    return {
      backgroundColor:
        focusedTrades.selectedTrades &&
        focusedTrades.selectedTrades.map((trade) => trade.id).includes(id)
          ? "#2D2B55"
          : "#222244",
      "&.MuiTableRow-root:hover": {
        backgroundColor: "#2D2B55",
        cursor: "pointer",
      },
    };
  };

  return (
    <div>
      <div style={{ height: "24px", padding: "5px" }}>
        <BaseDatePicker
          value={dayjs(focusedTrades.selectedDate)}
          format="YYYY/M"
          formatDensity="spacious"
          views={["year", "month"]}
          slotProps={{
            calendarHeader: { format: "YYYY/M" },
          }}
          onAccept={(e) => e && setHistoryTrades(new Date(e.valueOf()))}
        />
      </div>
      <TableContainer
        className="table-container"
        sx={{ width: 300, minWidth: 300 }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            direction: "ltr",
          }}
        >
          <TableHead sx={{ backgroundColor: "#eef" }}>
            <TableRow>
              <StickyTableCell align="center" sx={stickyStyles.header[0]}>
                時間
              </StickyTableCell>
              <StickyTableCell
                align="center"
                sx={stickyStyles.header[1]}
                colSpan={2}
              >
                銘柄
              </StickyTableCell>
              <StyledTableCell align="center">取引</StyledTableCell>
              <StyledTableCell align="center">株数</StyledTableCell>
              <StyledTableCell align="center">約定単価</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {focusedTrades.history.map((trade, i) => (
              <React.Fragment key={trade.id}>
                {/** 日付の変わり目で日付を表示 */}
                {(i == 0 ||
                  new Date(focusedTrades.history[i - 1].date).getDate() !==
                    new Date(trade.date).getDate()) && (
                  <TableRow>
                    <StickyTableCell align="center" sx={stickyStyles.cell[0]}>
                      {`${formatToDateDay(trade.date)}`}
                    </StickyTableCell>
                    <StickyTableCell
                      sx={stickyStyles.cell[1]}
                    ></StickyTableCell>
                    <StickyTableCell
                      sx={stickyStyles.cell[2]}
                    ></StickyTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                )}
                <TableRow
                  hover
                  sx={{
                    ...listBackroundColor(trade.id),
                  }}
                  onClick={() => selectTrade(trade.id)}
                  // onMouseEnter={() => setHoverTrade(trade)}
                  // onMouseLeave={() => setHoverTrade(null)}
                >
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[0],
                      ...listBackroundColor(trade.id),
                    }}
                    align="center"
                  >
                    {formatToTime(trade.date)}
                  </StickyTableCell>
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[1],
                      ...listBackroundColor(trade.id),
                    }}
                    align="center"
                  >
                    {trade.symbol}
                  </StickyTableCell>
                  <StickyTableCell
                    sx={{
                      ...stickyStyles.cell[2],
                      ...listBackroundColor(trade.id),
                    }}
                  >
                    {trade.company}
                  </StickyTableCell>
                  <StyledTableCell
                    sx={{ padding: "1px 3px", ...listBackroundColor(trade.id) }}
                  >
                    {trade.tradeType}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ padding: "1px 3px", ...listBackroundColor(trade.id) }}
                    align="right"
                  >
                    {priceFormatter(trade.quantity)}株
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ padding: "1px 3px", ...listBackroundColor(trade.id) }}
                    align="right"
                  >
                    {priceFormatter(trade.price)}円
                  </StyledTableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const StickyTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1E1E3F",
    color: "#ccf",
    padding: 0,
    fontSize: "11px",
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    maxWidth: "80px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    color: "#eef",
    fontSize: "11px",
    padding: 0,
    fontWeight: 200,
  },
}));
const StyledTableCell = styled(StickyTableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: "1px 3px",
    border: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: "1px 3px",
    border: 0,
  },
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   [`&.${tableRowClasses}`]: {
//     backgroundColor: '#fff',
//   },
//   [`&.${tableRowClasses.hover}`]: {
//     backgroundColor: '#317',
//   },
// }))
