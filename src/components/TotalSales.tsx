import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

import * as sale from "../db/repositories/sales";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function TotalSales() {
  const { enqueueSnackbar } = useSnackbar();
  const [salesAmount, setSalesAmount] = useState(0);
  const today = new Date();

  useEffect(() => {
    fetchSales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  async function fetchSales() {
    // Clean the sales array first
    setSalesAmount(0);

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
        .map((sale) => sale.value)
        .reduce((a, b) => a + b, 0);

      // Set sales amount
      setSalesAmount(parsedSales);
    } else {
      enqueueSnackbar(`Couldn't retrieve data`, {
        variant: "error",
      });
    }
  }

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Sales Amount</Title>
      <Typography component="p" variant="h4">
        {/* $3,024.00 */}
        {formatter.format(salesAmount)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {/* on 15 March, 2019 */}
        {today.toDateString()}
      </Typography>
    </React.Fragment>
  );
}
