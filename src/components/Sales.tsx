import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { useSnackbar } from "notistack";

import * as sale from "../db/repositories/sales";
import * as client from "../db/repositories/clients";

interface ISale {
  id?: string;
  firstname: string;
  lastname: string;
  company: string;
  clientId: string;
  description: string;
  date: string;
  value: number;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Sales() {
  const classes = useStyles();
  const [sales, setSales] = useState<ISale[]>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSales() {
    // Clean the sales array first
    setSales([]);

    // Fetch sales from repository
    const _sales = await sale.all();
    const _clients = await client.all();
    if (_sales && _clients) {
      // Parse response to split data
      const parsedSales = _sales.map((sale) => {
        let [saleClient] = _clients.filter(
          (client) => client.id === sale.clientId
        );
        if (!saleClient) {
          saleClient = {
            firstname: "Client not found",
            lastname: "or removed",
            company: "Company not found or removed",
            email: "",
            debt: 0,
            credit: 0,
          };
        }
        return {
          ...sale,
          date: `${sale.date.split(" ")[0]} ${sale.date.split(" ")[1]} ${
            sale.date.split(" ")[2]
          }`,
          firstname: saleClient.firstname,
          lastname: saleClient.lastname,
          company: saleClient.company,
        };
      }) as ISale[];

      // Sort Sales by date
      const sortedSales = parsedSales.slice(0, 5).sort((a, b) => {
        return (new Date(b.date)).getDate() - (new Date(a.date)).getDate();
      });
      
      // Set sales to state
      setSales(sortedSales);
    } else {
      enqueueSnackbar(`Couldn't retrieve data`, {
        variant: "error",
      });
    }
  }

  return (
    <React.Fragment>
      <Title>Recent Sales</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Sales Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales &&
            sales.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{`${row.firstname} ${row.lastname}`}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">
                  {formatter.format(row.value)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <ThemeLink to="/sales">See more sales</ThemeLink>
      </div>
    </React.Fragment>
  );
}

const ThemeLink = styled(Link)`
  color: #00695c;
  text-decoration: none;
`;
