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
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

import * as client from "../../../db/repositories/clients";
import * as sale from "../../../db/repositories/sales";
import { useSnackbar } from "notistack";

interface IClient {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  company: string;
  email: string;
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

export default function SaleRegister() {
  const classes = useStyles();
  const textFieldClasses = useTextFieldStyles();
  const history = useHistory();
  const redirectPath = "/sales";
  const refresh = useRefresh(history, redirectPath);
  const { enqueueSnackbar } = useSnackbar();

  // Some needed states
  const [clients, setClients] = useState<Array<IClient>>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Input States
  const [date, setDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");

  // Error Flags
  const [dateErr, setDateErr] = useState(false);
  const [descriptionErr, setDescriptionErr] = useState(false);
  const [clientIdErr, setClientIdErr] = useState(false);
  const [valueErr, setValueErr] = useState(false);

  // Redirects to Sales List page
  useEffect(() => {
    if (registerSuccess === true) {
      setRegisterSuccess(false);
      if (history.location.pathname === redirectPath) {
        refresh();
      } else {
        history.push(redirectPath);
      }
    }
  }, [registerSuccess, history, refresh]);

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchClients() {
    // Clean the clients array first
    setClients([]);

    // Fetch clients from repository
    const _clients = await client.all();

    if (_clients) {
      const parsedClients = _clients.map((client) => {
        return {
          firstname: client.firstname,
          lastname: client.lastname,
          company: client.company,
          email: client.email,
          id: client.id!,
          name: `${client.firstname} ${client.lastname} - ${client.company}`,
          credit: client.credit,
          debt: client.debt,
        };
      });
      // Set clients to state
      setClients(parsedClients);
    } else {
      enqueueSnackbar(`Couldn't retrieve data.`, {
        variant: "error",
      });
    }
  }

  const onSubmit = async (e: FormEvent) => {
    // Prevent form reload the page
    e.preventDefault();

    // Disable the form input and button
    setIsSubmitting(true);

    // Error flag
    let err = false;

    if (!clientId) {
      setClientIdErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please seleact a client.`, {
        variant: "error",
      });
      err = true;
    }
    if (!date) {
      setDateErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please select the date.`, {
        variant: "error",
      });
      err = true;
    }
    if (!description) {
      setDescriptionErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please write a simple description.`, {
        variant: "error",
      });
      err = true;
    }
    if (value === 0) {
      setValueErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`The sale value cannot be 0.`, {
        variant: "error",
      });
      err = true;
    }
    if (clientId && date && description && value > 0 && !err) {
      const [saleClient] = clients.filter((client) => client.id === clientId);

      await sale
        .create({
          clientId,
          date,
          description,
          value,
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(`Error registering the sale.`, {
            variant: "error",
          });
        });

      if (saleClient.credit === 0) {
        await client
          .update(clientId, {
            ...saleClient,
            debt: Number((saleClient.debt + value).toFixed(2)),
          })
          .catch((err) => {
            console.log(err);
            enqueueSnackbar(`Error updating the client.`, {
              variant: "error",
            });
          });
      } else {
        if ((saleClient.credit - value) < 0) {
          const rest = Math.abs(saleClient.credit - value);
          const valueToDecrease = value - rest;

          await client
            .update(clientId, {
              ...saleClient,
              credit: Number((saleClient.credit - valueToDecrease).toFixed(2)),
              debt: Number((saleClient.debt + rest).toFixed(2)),
            })
            .catch((err) => {
              console.log(err);
              enqueueSnackbar(`Error updating the client.`, {
                variant: "error",
              });
            });
        } else {
          await client
            .update(clientId, {
              ...saleClient,
              credit: Number((saleClient.credit - value).toFixed(2)),
            })
            .catch((err) => {
              console.log(err);
              enqueueSnackbar(`Error updating the client.`, {
                variant: "error",
              });
              return;
            });
        }
      }

      // Redirects to Clients
      setRegisterSuccess(true);

      enqueueSnackbar(`Sale Registered.`, {
        variant: "success",
      });

      // Clean the form
      setClientId("");
      setDate(new Date());
      setDescription("");
      setValue(0);

      // Reset Error Flags
      setClientIdErr(false);
      setDateErr(false);
      setDescriptionErr(false);
      setValueErr(false);

      // Stop Circle progress
      setIsSubmitting(false);
    } else {
      return;
    }
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
                <Grid item>
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
                      setClientIdErr(false);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Client"
                        variant="outlined"
                        placeholder="Select the client"
                        helperText={"Mandatory"}
                        error={clientIdErr}
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
                      value={date}
                      openTo="date"
                      error={dateErr}
                      helperText={"Mandatory"}
                      onChange={(date) => {
                        setDate(date);
                        setDateErr(false);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <KeyboardTimePicker
                      label={"Time"}
                      id="time-picker"
                      autoOk
                      fullWidth
                      variant="inline"
                      placeholder={"Select the date"}
                      inputVariant="outlined"
                      color="primary"
                      value={date}
                      error={dateErr}
                      helperText={"Mandatory"}
                      onChange={(date) => {
                        setDate(date);
                        setDateErr(false);
                      }}
                      keyboardIcon={<AccessTimeIcon />}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                  <TextField
                    required
                    id="outlined-required"
                    label="Description"
                    type="text"
                    placeholder="A brief description"
                    variant="outlined"
                    value={description}
                    error={descriptionErr}
                    disabled={isSubmitting}
                    helperText={"Mandatory"}
                    onChange={(e) => {
                      setDescriptionErr(false);
                      setDescription(e.target.value);
                    }}
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
                value={value.toString()}
                disabled={isSubmitting}
                error={valueErr}
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
                    <CircularProgress color="primary" />
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
