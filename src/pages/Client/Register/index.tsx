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

import * as client from "../../../db/repositories/clients";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [debt, setDebt] = useState<number>();
  const [credit, setCredit] = useState<number>();

  // Fetch all clients when this view mounted
  useEffect(() => {
    if (isSubmitting === false) {
      if (history.location.pathname === redirectPath) {
        refresh();
      } else {
        history.push(redirectPath);
      }
    }
  }, [isSubmitting, history, refresh]);

  const onSubmit = async (e: FormEvent) => {
    // Prevent form reload the page
    e.preventDefault();

    // Disable the form input and button
    setIsSubmitting(true);

    // Repository function to call is depend on isEditMode state
    if (!isEditMode)
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
    setIsEditMode(false);
  };

  return (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid style={{ paddingBottom: 12 }} container>
            <Typography variant="h4" color="primary" align="left">
              Client Register
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
              xs={10}
              md={10}
              sm={10}
            >
              <Grid
                container
                direction="row"
                spacing={2}
                xs={10}
                md={10}
                sm={10}
              >
                <Grid item xs={5} md={6}>
                  <TextField
                    required
                    id="outlined-required"
                    label="First Name"
                    type="name"
                    placeholder="Ex.: Renata"
                    variant="outlined"
                    value={firstname}
                    disabled={isSubmitting}
                    onChange={(e) => setFirstname(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
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
                  />
                </Grid>
              </Grid>
              <Grid container direction="row" xs={10} md={10} sm={10}>
                <Grid item xs={5} md={6}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    type="email"
                    placeholder="Ex.: exemple@exemple.com"
                    variant="outlined"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    required
                    id="outlined-required"
                    label="Company"
                    type="text"
                    placeholder="Ex.: Google"
                    variant="outlined"
                    value={company}
                    disabled={isSubmitting}
                    onChange={(e) => setCompany(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Divider style={{ margin: "30px 0" }} />
              <Grid style={{ paddingBottom: 12, paddingLeft: 8 }} container>
                <Typography variant="h6" color="primary" align="left">
                  Initial Situation
                </Typography>
              </Grid>
              <TextField
                id="outlined-number"
                label="Credit"
                type="number"
                variant="outlined"
                value={credit || "0"}
                disabled={isSubmitting}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  val >= 0 && setCredit(val);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="outlined-number"
                label="Debt"
                type="number"
                variant="outlined"
                value={debt || "0"}
                disabled={isSubmitting}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  val >= 0 && setDebt(val);
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
