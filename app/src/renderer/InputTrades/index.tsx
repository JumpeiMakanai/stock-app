import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { formatToDateTime } from "../TradesHistory/hooks/formatToTime";

import { AddRecordTable } from "./components/AddRecordTable";
import { CSVInmport } from "./components/CSVImport";
import {
  InputTradesProvider,
  useInputTrades,
  useInputTradesDispatch,
} from "./InputTradesContext";
import type { TradeRecord } from "src/types/TradeType";

export const InputTrades = () => {
  return (
    <>
      <InputTradesProvider>
        <NewAddChild></NewAddChild>
      </InputTradesProvider>
    </>
  );
};

const NewAddChild = () => {
  const tradeGroups = useInputTrades();
  const dispatch = useInputTradesDispatch();
  const [ableInsert, setAbleInsert] = useState(true);
  const [message, setMessage] = useState("");

  const toNum = (v: unknown, def = 0) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : def;
  };

  const flatTrades = () => {
    if (!tradeGroups) return [];
    return tradeGroups.flatMap((trades) => {
      if (!trades.length) return trades;

      const head = { ...trades[0] };

      // まず全て数値化（特に CSV/フォーム起源を想定）
      head.quantity = toNum(head.quantity);
      head.price = toNum(head.price);
      head.fee = toNum(head.fee);
      head.tax = toNum(head.tax);

      head.price = head.price * head.quantity;

      for (let i = 1; i < trades.length; i++) {
        const t = trades[i];
        const q = toNum(t.quantity);
        const p = toNum(t.price);
        const f = toNum(t.fee);
        const x = toNum(t.tax);

        head.quantity += q;
        head.price += p * q;
        head.fee += f; // ← 文字列連結を防ぐ
        head.tax += x;
      }

      if (head.quantity > 0) head.price = head.price / head.quantity;

      // OpenAPI TradeInsert に合わせて不要プロパティを落とすならここで整形
      return [
        {
          id: head.id,
          date: toNum(head.date),
          symbol: head.symbol,
          tradeType: head.tradeType,
          holdType: head.holdType,
          quantity: toNum(head.quantity),
          restQuantity: toNum(head.restQuantity),
          price: toNum(head.price),
          fee: toNum(head.fee),
          tax: toNum(head.tax),
        },
      ];
    });
  };

  function setResultMessage(props: {
    result: "fail";
    trade?: TradeRecord;
  }): void;
  function setResultMessage(props: {
    result: "succeed";
    recordNum: number;
  }): void;
  function setResultMessage(
    props:
      | { result: "fail"; trade?: TradeRecord }
      | { result: "succeed"; recordNum: number }
  ) {
    if (props.result === "fail") {
      const recordSummary =
        typeof props.trade === "object"
          ? `(${formatToDateTime(props.trade.date)} <strong>${props.trade.symbol}</strong>)`
          : "";
      setMessage(
        `<p style='color: #FAD02C'>保存に失敗しました${recordSummary}</p>`
      );
    } else {
      setMessage(
        `<p style='color: white'>${props.recordNum}件の取引を保存しました</p>`
      );
    }
  }

  const insert = () => {
    if (!ableInsert) return;
    setAbleInsert(false);
    resetMessage();

    const trades = flatTrades();
    fetch("http://localhost:4010/trades", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trades),
    })
      .then(() => {
        console.log("insert resolve");
        dispatch && dispatch({ type: "reset" });
        setAbleInsert(true);
        setResultMessage({ result: "succeed", recordNum: trades.length });
      })
      .catch((err) => {
        setAbleInsert(true);
        if (err && err.failId) {
          trades.forEach((trade) => {
            if (trade.id == err.failId)
              setResultMessage({ result: "fail", trade });
          });
        } else {
          setResultMessage({ result: "fail" });
        }
      });
  };

  const resetMessage = () => {
    setMessage("");
  };

  return (
    <div>
      <div style={{ display: "flex", maxHeight: "34px" }}>
        <Button
          sx={{
            height: "24px",
            margin: "5px",
            color: "#ccf",
            backgroundColor: "rgba(150,150,220,0.3)",
            fontSize: "11px",
            fontWeight: 600,
            "&.MuiButtonBase-root:hover": {
              color: "#1E1E3F",
              backgroundColor: "rgba(200,200,255,0.7)",
            },
          }}
          onClick={insert}
        >
          保存
        </Button>
        <CSVInmport setResultMessage={setResultMessage} />
        <HeadMessage message={message} reset={resetMessage} />
      </div>
      <AddRecordTable tradeGroups={tradeGroups} />
      <div
        style={{
          height: "12px",
          padding: "14px",
          fontSize: "12px",
          fontWeight: 600,
          left: 0,
          bottom: 0,
          zIndex: 2,
          color: "#779",
          background: "#292949",
          position: "sticky",
          textAlign: "center",
          cursor: "pointer",
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#292949";
          e.currentTarget.style.color = "#779";
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#336";
          e.currentTarget.style.color = "#dde";
        }}
        onClick={() => dispatch && dispatch({ type: "add" })}
      >
        新規追加
      </div>
    </div>
  );
};

const HeadMessage = (props: { message: string; reset: () => void }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let timeoutId2: ReturnType<typeof setTimeout>;

    if (messageRef.current) messageRef.current.innerHTML = props.message;
    setOpacity(1);

    const timeoutId1 = setTimeout(() => {
      setOpacity(0);
      timeoutId2 = setTimeout(() => {
        props.reset();
      }, 300);
    }, 3000);

    return () => {
      // クリーンアップ
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, [props.message]);

  return (
    <div
      ref={messageRef}
      style={{
        fontSize: "11px",
        margin: "auto",
        opacity,
        transition: "opacity 0.3s",
      }}
    ></div>
  );
};
