import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";

import * as sale from "../db/repositories/sales";
import { useSnackbar } from "notistack";

interface TodaySale {
  time: string;
  value: number;
}

// Generate Sales Data
function createData(time: any, value: any) {
  return { time, value };
}

const standardData = [
  createData("00:00", 0),
  createData("03:00", 0),
  createData("06:00", 0),
  createData("09:00", 0),
  createData("12:00", 0),
  createData("15:00", 0),
  createData("18:00", 0),
  createData("21:00", 0),
  createData("24:00", 0),
];

export default function Chart() {
  const theme = useTheme();
  const {enqueueSnackbar} = useSnackbar();
  const [todaySales, setTodaySales] = useState<TodaySale[]>();

  useEffect(() => {
    fetchSales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSales() {
    // Clean the sales array first
    setTodaySales([]);

    // Fetch sales from repository
    const _sales = await sale.all();

    const today = new Date();

    if (_sales) {
      // Parse response to split data
      const parsedSales = _sales
        .filter(
          (sale) =>
            new Date(sale.date).getDate() === today.getDate() &&
            new Date(sale.date).getMonth() === today.getMonth() &&
            new Date(sale.date).getFullYear() === today.getFullYear()
        )
        .map((sale) => {
          return {
            time: sale.date.split(" ")[4],
            value: Math.round(sale.value),
          };
        }) as TodaySale[];

      // Set sales to state
      if (parsedSales.length > 0) {
        setTodaySales(parsedSales);
      } else {
        enqueueSnackbar(`No sales made today`, {
          variant: "info",
          persist: true,
        });
        setTodaySales(standardData);
      }
    } else {
      enqueueSnackbar(`Couldn't retrieve data`, {
        variant: "error",
      });
    }
  }

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={todaySales}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="value"
            stroke={"rgb(38,166,154,1)"}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
