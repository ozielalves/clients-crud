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
} from "@material-ui/core";
import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import { Close } from "@material-ui/icons";

import * as client from "../db/repositories/clients";

interface props {
  open: boolean;
  onClose: () => void;
  clientData: any;
  onRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal = ({ open, onClose, clientData, onRefresh }: props) => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [debt, setDebt] = useState<number>();
  const [credit, setCredit] = useState<number>();
  const [noChanges, setNoChanges] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Erros
  /* const [stateError, setStateError] = useState<boolean>(false);
  const [quantityError, setQuantityError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [throughRetailerError, setThroughRetailerError] = useState<boolean>(
    false
  ); */

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

  /* useEffect(() => {
    if (readyToEdit) {
      if (editedClient) {
        setSellThroughEditedData({
          id: editedClient.id
          client_id: selectedClient
            ? selectedClient.id !== undefined
              ? selectedClient.id
              : null
            : null,
          retailer_id: clientData.retailer_id,
          product_id: clientData.product_id,
          through_retailer_id: STValues.through_retailer_id,
          unit_price: STValues.unit_price,
          quantity: STValues.quantity,
          month: STValues.month!,
          year: STValues.year!,
          state: selectedState?.abbreviation,
        });
    }
  }, [
    readyToEdit,
    setSellThroughEditedData,
    clientData,
    selectedClient,
    selectedState,
    STValues,
    noChanges,
  ]); */

  const onSubmit = async (e: FormEvent) => {
    // Prevent form reload the page
    e.preventDefault();

    // Disable the form input and button
    setIsSubmitting(true);

    // Repository function to call
    await client.update(clientData.id, {
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

    // Fetch clients
    onRefresh(true);

    // Close the modal
    onClose();

    // State life control
    setNoChanges(true);
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        position: "absolute",
        width: 635,
        height: 666,
        backgroundColor: theme.palette.background.paper,
        border: "none",
        borderRadius: "10px",
        padding: theme.spacing(2, 4, 0),
        outline: "none !important",
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
    const top = 54;
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
                    required
                    id="outlined-required"
                    label="First Name"
                    type="name"
                    placeholder="Ex.: Renata"
                    variant="outlined"
                    value={firstname}
                    disabled={isSubmitting}
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
                    value={lastname}
                    disabled={isSubmitting}
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
              <Grid container spacing={2} xs={12} md={12} sm={12}>
                <Grid item xs={5} md={5}>
                  <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    type="email"
                    placeholder="Ex.: exemple@exemple.com"
                    variant="outlined"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
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
                    label="Company"
                    type="text"
                    placeholder="Ex.: Google"
                    variant="outlined"
                    value={company}
                    disabled={isSubmitting}
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
                  value={credit || "0"}
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
                  value={debt || "0"}
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
                style={{ marginTop: 100 }}
                justify="flex-end"
              >
                <Grid item>
                  {isSubmitting ? (
                    <CircularProgress color="secondary" />
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
