import ListAltIcon from "@mui/icons-material/ListAlt";
import { Tooltip } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import { StyledInputSelect } from "renderer/Parts/InputSelect/StyledInputSelect";
import {
  BaseDatePicker,
  IconButtonNormal,
  QuarterPicker,
} from "renderer/Parts/MyMui";
import {
  useEChartsOption,
  useEChartsOptionDispatch,
} from "../../EChartsOptionContext";
import { getDayCustom } from "../../hooks/getDayCustom";
import type { PnLInterval, TradeRecordPnL } from "renderer/../types/PnLType";

export const PnLHeader = (props: { toggle: () => void }) => {
  const eChartsOption = useEChartsOption();
  const eChartsOptionDispatch = useEChartsOptionDispatch();

  return (
    <div
      style={{
        height: "34px",
        fontSize: "13px",
        display: "flex",
      }}
    >
      <StyledInputSelect
        value={eChartsOption?.interval}
        onChange={(e) =>
          eChartsOptionDispatch &&
          eChartsOptionDispatch({
            type: "setInterval",
            interval: e.target.value as PnLInterval,
          })
        }
        style={{
          width: "50px",
          height: "22.5px",
          marginTop: "6px",
          marginLeft: "3px",
          marginRight: "6px",
        }}
      >
        <option value="1d">日</option>
        <option value="1w">週</option>
        <option value="1mo">月</option>
        <option value="1y">年</option>
      </StyledInputSelect>
      <div style={{ height: "24px", padding: "5px" }}>
        <SwitchDatePicker />
      </div>

      <Tooltip title={"リスト"}>
        <IconButtonNormal
          onClick={props.toggle}
          size="small"
          style={{
            margin: "3px 15px 3px auto",
          }}
        >
          <ListAltIcon style={{ color: "#ccf" }} fontSize="inherit" />
        </IconButtonNormal>
      </Tooltip>
    </div>
  );
};

const SwitchDatePicker = () => {
  const eChartsOption = useEChartsOption();
  const eChartsOptionDispatch = useEChartsOptionDispatch();
  const [minDate, setMinDate] = useState(dayjs(new Date()));
  const [maxDate, setMaxDate] = useState(dayjs(new Date()));

  useEffect(() => {
    // min
    fetch("http://localhost:4010/trades/select/pnl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filterOptions: { mode: "PnL", limit: 1, order: "ASC" }}),
    })
      .then((res) => res.json())
      .then((trades: TradeRecordPnL[]) => {
        if (trades.length) setMinDate(dayjs(trades[0].date));
        else {
          const d = dayjs(minDate);
          d.set("year", minDate.get("year") - 30);
        }
      })
      .catch((e) => console.log(e));

    // max
    fetch("http://localhost:4010/trades/select/pnl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filterOptions: { mode: "PnL", limit: 1, order: "DESC" }}),
    })
      .then((res) => res.json())
      .then((trades: TradeRecordPnL[]) => {
        if (trades.length) setMaxDate(dayjs(trades[0].date));
      })
      .catch((e) => console.log(e));
  }, []);

  const changeFunc = (e: Dayjs) => {
    eChartsOptionDispatch &&
      eChartsOptionDispatch({
        type: "setDate",
        date: new Date(e.toString()),
      });
  };

  switch (eChartsOption?.interval) {
    case "1d":
      return (
        <BaseDatePicker
          format="YYYY/M"
          formatDensity="spacious"
          closeOnSelect={true}
          views={["year", "month"]}
          slotProps={{
            calendarHeader: { format: "YYYY / M" },
          }}
          onChange={(day) => day && changeFunc(day)}
          minDate={minDate}
          maxDate={maxDate}
          value={dayjs(eChartsOption.date)}
        />
      );
    case "1w":
      minDate.set(
        "date",
        minDate.get("date") - getDayCustom(minDate.valueOf())
      );
      maxDate.set(
        "date",
        maxDate.get("date") - getDayCustom(maxDate.valueOf())
      );
      return (
        <QuarterPicker
          onChange={(day) => day && changeFunc(day)}
          minDate={dayjs(minDate)}
          maxDate={dayjs(maxDate)}
          value={dayjs(eChartsOption.date)}
        />
      );
    case "1mo":
      return (
        <BaseDatePicker
          format="YYYY"
          formatDensity="spacious"
          closeOnSelect={true}
          // calendar header を表示するために2つ入れる
          views={["year", "year"]}
          slotProps={{
            calendarHeader: { format: "YYYY" },
          }}
          onChange={(day) => day && changeFunc(day)}
          minDate={minDate}
          maxDate={maxDate}
          value={dayjs(eChartsOption.date)}
        />
      );
  }
  return <div></div>;
};
