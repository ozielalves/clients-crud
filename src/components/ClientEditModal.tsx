import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { Close } from "@material-ui/icons";

import * as client from "../db/repositories/clients";
import { useSnackbar } from "notistack";

interface props {
  open: boolean;
  onClose: () => void;
  clientData: any;
  onRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal = ({ open, onClose, clientData, onRefresh }: props) => {
  // Some needed things
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const isTabletOrDesktop = useMediaQuery('(min-width:600px)');
  const isSmallestMedia = useMediaQuery('(max-width:280px)');

  // Input States
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [debt, setDebt] = useState(0);
  const [credit, setCredit] = useState(0);
  const [noChanges, setNoChanges] = useState(true);

  // Error Flags
  const [companyErr, setCompanyErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [lastnameErr, setLastnameErr] = useState(false);
  const [firstnameErr, setFirstnameErr] = useState(false);
  const [debtErr, setDebtErr] = useState(false);
  const [creditErr, setCreditErr] = useState(false);

  useEffect(() => {
    function getClientData() {
      if (clientData) {
        setCompany(clientData.company);
        setEmail(clientData.email);
        setLastname(clientData.lastname);
        setFirstname(clientData.firstname);
        setDebt(clientData.debt);
        setCredit(clientData.credit);
      }
    }
    getClientData();
  }, [clientData]);

  const onSubmit = async (e: FormEvent) => {
    // Prevent form reload the page
    e.preventDefault();

    // Disable the form input and button
    setIsSubmitting(true);

    // Error flag
    let err = false;

    if (!firstname) {
      setFirstnameErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide the client's first name.`, {
        variant: "error",
      });
      err = true;
    }
    if (!lastname) {
      setLastnameErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide the client's last name.`, {
        variant: "error",
      });
      err = true;
    }
    if (!email) {
      setEmailErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide the client's email.`, {
        variant: "error",
      });
      err = true;
    }
    if (!company) {
      setCompanyErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide the client's company.`, {
        variant: "error",
      });
      err = true;
    }
    if (credit < 0) {
      setCreditErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide a credit value greater than 0.`, {
        variant: "error",
      });
      err = true;
    }
    if (debt < 0) {
      setFirstnameErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please provide a debt value greater than 0.`, {
        variant: "error",
      });
      err = true;
    }
    if (
      firstname &&
      lastname &&
      email &&
      company &&
      credit >= 0 &&
      debt >= 0 &&
      !err
    ) {
      // Repository function to call
      await client
        .update(clientData.id, {
          company: company,
          firstname: firstname,
          lastname: lastname,
          email: email,
          debt: debt ? debt : 0,
          credit: credit ? credit : 0,
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(`Error updating the client.`, {
            variant: "error",
          });
          return;
        });

      enqueueSnackbar(`Client edited successfuly.`, {
        variant: "success",
      });

      // Clean the form
      setCompany("");
      setEmail("");
      setLastname("");
      setFirstname("");
      setDebt(0);
      setCredit(0);

      // Reset Error Flags
      setCompanyErr(false);
      setEmailErr(false);
      setLastnameErr(false);
      setFirstnameErr(false);
      setDebtErr(false);
      setCreditErr(false);

      // Stop Circle progress
      setIsSubmitting(false);

      // Close the modal
      onClose();

      // Fetch clients
      onRefresh(true);

      // State life control
      setNoChanges(true);
    } else {
      return;
    }
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        position: "absolute",
        width: isTabletOrDesktop ? 635 : isSmallestMedia ? 264 : 350,
        height: 555,
        backgroundColor: theme.palette.background.paper,
        border: "none",
        borderRadius: "10px",
        padding: theme.spacing(2, 4, 0),
        outline: "none !important",
        overflowY: "auto",
      },
      dialog: {
        minHeight: "666px",
        maxHeight: "666px",
        maxWidth: "635px",
        minWidth: "635px",
      },
      root: {
        padding: "0",
      },
    })
  );

  const useTextFieldStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        "& .MuiTextField-root": {
          margin: theme.spacing(1),
          width: "25ch",
        },
      },
    })
  );

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-50%, -${left}%)`,
    };
  }

  const classes = useStyles();
  const textFieldClasses = useTextFieldStyles();
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          onClose();
          setNoChanges(true);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container style={modalStyle} className={classes.paper}>
          <Box display="flex" style={{ width: "100%" }}>
            <Box flexGrow={1} style={{ paddingTop: 12 }}>
              <Typography variant="h4" color="primary" align="left">
                Edit Client
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={() => {
                  onClose();
                  setNoChanges(true);
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
          {/* form to update a client */}
          <form
            onSubmit={onSubmit}
            style={{ paddingTop: 20 }}
            className={textFieldClasses.root}
          >
            <Grid container spacing={2} xs={12} md={12}>
              <Grid container spacing={2} xs={12} md={12} sm={12}>
                <Grid item xs={5} md={5}>
                  <TextField
                    id="outlined-required"
                    label="Email"
                    type="email"
                    placeholder="Ex.: exemple@exemple.com"
                    variant="outlined"
                    error={emailErr}
                    value={email}
                    disabled={true}
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
                    error={companyErr}
                    value={company}
                    disabled={isSubmitting}
                    helperText={"Mandatory"}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setNoChanges(false);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} xs={12} md={12} sm={12}>
                <Grid item xs={5} md={5}>
                  <TextField
                    required
                    id="outlined-required"
                    label="First Name"
                    type="name"
                    placeholder="Ex.: Renata"
                    variant="outlined"
                    error={firstnameErr}
                    value={firstname}
                    disabled={isSubmitting}
                    helperText={"Mandatory"}
                    onChange={(e) => {
                      setFirstname(e.target.value);
                      setNoChanges(false);
                    }}
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
                    error={lastnameErr}
                    value={lastname}
                    disabled={isSubmitting}
                    helperText={"Mandatory"}
                    onChange={(e) => {
                      setLastname(e.target.value);
                      setNoChanges(false);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
              <Divider style={{ margin: "10px 0" }} />
              <Grid style={{ padding: "30px 0 12px 8px" }} container>
                <Typography variant="h6" color="primary" align="left">
                  Finance
                </Typography>
              </Grid>
              <Grid container xs={12} md={12}>
                <TextField
                  id="outlined-number"
                  label="Credit"
                  type="number"
                  variant="outlined"
                  error={creditErr}
                  value={credit.toString()}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    val >= 0 && setCredit(val);
                    setNoChanges(false);
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
                  error={debtErr}
                  value={debt.toString()}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    val >= 0 && setDebt(val);
                    setNoChanges(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid
                item
                container
                spacing={1}
                style={{ marginTop: 50 }}
                justify="flex-end"
              >
                <Grid item>
                  {isSubmitting ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <ActionButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={noChanges || isSubmitting}
                    >
                      Edit
                    </ActionButton>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Modal>
    </>
  );
};

const ActionButton = styled(Button)`
  height: 35px;
  width: 100px;
  border-radius: 6px;
  padding: 9px, 20px;
  margin-bottom: 10px;
`;

export default EditModal;
