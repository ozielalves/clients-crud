import React, { FormEvent, useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import useRefresh from "../../../routes/useRefresh";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";

import * as client from "../../../db/repositories/clients";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

interface IClient {
  id: string;
  name: string;
  credit: number;
  debt: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  centerItem: {
    height: 240,
    display: "flex",
    alignItems: "center",
    paddingTop: "60px",
  },
}));

const useTextFieldStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "35ch",
      },
    },
  })
);

export default function ClientRegister() {
  const classes = useStyles();
  const textFieldClasses = useTextFieldStyles();
  const history = useHistory();
  const redirectPath = "/clients";
  const refresh = useRefresh(history, redirectPath);

  // Some needed states
  const [clients, setClients] = useState<Array<IClient>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [debt, setDebt] = useState<number>();
  const [credit, setCredit] = useState<number>();
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");

  // Redirects to Sales List page
  useEffect(() => {
    if (isSubmitting === false) {
      if (history.location.pathname === redirectPath) {
        refresh();
      } else {
        history.push(redirectPath);
      }
    }
  }, [isSubmitting, history, refresh]);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    // Clean the clients array first
    setClients([]);

    // Fetch clients from repository
    const _clients = await client.all();

    console.log("CLIENTS DATA: ", typeof _clients); // PRINT
    const parsedClients = _clients.map((client) => {
      return {
        id: client.id!,
        name: `${client.firstname} ${client.lastname}`,
        credit: client.credit,
        debt: client.debt,
      };
    });
    // Set clients to state
    setClients(parsedClients);
  }

  const onSubmit = async (e: FormEvent) => {
    // Prevent form reload the page
    e.preventDefault();

    // Disable the form input and button
    setIsSubmitting(true);

    // Repository function to create a Sale
    await client.create({
      company: company,
      firstname: firstname,
      lastname: lastname,
      email: email,
      debt: debt ? debt : 0,
      credit: credit ? credit : 0,
    });

    // Clean the form
    setCompany("");
    setEmail("");
    setLastname("");
    setFirstname("");
    setDebt(0);
    setCredit(0);
    setIsSubmitting(false);
  };

  return (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid style={{ paddingBottom: 12 }} container>
            <Typography variant="h4" color="primary" align="left">
              Sale Register
            </Typography>
          </Grid>
          {/* Form to create a client*/}
          <form
            onSubmit={onSubmit}
            style={{ paddingTop: 20 }}
            className={textFieldClasses.root}
          >
            <Grid
              container
              direction="column"
              spacing={2}
              xs={12}
              md={12}
              sm={12}
            >
              <Grid
                container
                direction="row"
                spacing={2}
                xs={12}
                md={12}
                sm={12}
              >
                <Grid item >
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.name}
                    loadingText="Loading..."
                    openText="Open"
                    closeText="Close"
                    clearText="Clean"
                    disabled={isSubmitting}
                    onChange={(_, value) => {
                      value && setClientId(value.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Client"
                        variant="outlined"
                        placeholder="Select the client"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      label={"Date"}
                      autoOk
                      fullWidth
                      leftArrowIcon
                      variant="inline"
                      placeholder={"Select the date"}
                      inputVariant="outlined"
                      color="primary"
                      format="MM/dd/yyyy"
                      value={date}
                      openTo="date"
                      views={["date", "year", "month"]}
                      /* error={dateError && dateError} */
                      helperText={"Obrigatório"}
                      onChange={(date) => setDate(date)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  {/* <TextField
                    required
                    id="outlined-required"
                    label="Last Name"
                    type="name"
                    placeholder="Ex.: Silva"
                    variant="outlined"
                    value={lastname}
                    disabled={isSubmitting}
                    onChange={(e) => setLastname(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  /> */}
                </Grid>
                <Grid item >
                  <TextField
                    required
                    id="outlined-required"
                    label="Description"
                    type="text"
                    placeholder="A brief description"
                    variant="outlined"
                    value={description}
                    disabled={isSubmitting}
                    onChange={(e) => setDescription(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Divider style={{ margin: "30px 0" }} />
              <Grid style={{ paddingBottom: 12, paddingLeft: 8 }} container>
                <Typography variant="h6" color="primary" align="left">
                  Total
                </Typography>
              </Grid>
              <TextField
                id="outlined-number"
                label="Value"
                type="number"
                variant="outlined"
                value={value}
                disabled={isSubmitting}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  val >= 0 && setValue(val);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Grid item container spacing={1} justify="flex-end">
                <Grid item>
                  {isSubmitting ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <ActionButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Register
                    </ActionButton>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Container>
      </main>
    </div>
  );
}

const ActionButton = styled(Button)`
  height: 35px;
  width: 100px;
  border-radius: 6px;
  padding: 9px, 20px;
`;
