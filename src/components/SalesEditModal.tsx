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
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Close } from "@material-ui/icons";

import * as client from "../db/repositories/clients";
import * as sale from "../db/repositories/sales";
import { useSnackbar } from "notistack";

interface IClient {
  id: string;
  name: string;
  credit: number;
  debt: number;
}

interface props {
  open: boolean;
  onClose: () => void;
  saleData: any;
  onRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SaleEditModal = ({ open, onClose, saleData, onRefresh }: props) => {
  const [noChanges, setNoChanges] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [clientNotFound, setClientNotFound] = useState(false);

  const [clients, setClients] = useState<IClient[]>();
  const [date, setDate] = useState<Date | null>(null);
  const [value, setValue] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");

  // Error Flags
  const [descriptionErr, setDescriptionErr] = useState(false);
  const [valueErr, setValueErr] = useState(false);

  useEffect(() => {
    function getClientData() {
      if (saleData) {
        setDate(new Date(saleData.date));
        setClientId(saleData.clientId);
        setValue(saleData.value);
        setDescription(saleData.description);
      }
    }
    getClientData();
  }, [saleData]);

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
          id: client.id!,
          name: `${client.firstname} ${client.lastname} - ${client.company}`,
          credit: client.credit,
          debt: client.debt,
        };
      });

      const [saleClient] = _clients.filter(
        (client) => client.id === saleData.clientId
      );

      if (!saleClient) {
        setClientNotFound(true);
        enqueueSnackbar(`Please delete this sale.`, {
          variant: "info",
        });
      }

      // Set clients to state
      setClients(parsedClients);
    } else {
      enqueueSnackbar(`Couldn't retrieve clients`, {
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

    if (!description) {
      setDescriptionErr(true);
      setIsSubmitting(false);
      enqueueSnackbar(`Please write a simpledescription.`, {
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
    if (description && date && value > 0 && !err) {
      await sale
        .update(saleData.id, {
          clientId,
          date,
          description,
          value,
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(`Error updating the sale.`, {
            variant: "error",
          });
          return;
        });

      // Clean the form
      setClientId("");
      setDate(new Date());
      setDescription("");
      setValue(0);
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
        width: 635,
        height: 555,
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
          setClientNotFound(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container style={modalStyle} className={classes.paper}>
          <Box display="flex" style={{ width: "100%" }}>
            <Box flexGrow={1} style={{ paddingTop: 12 }}>
              <Typography variant="h4" color="primary" align="left">
                Edit Sale
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={() => {
                  onClose();
                  setNoChanges(true);
                  setClientNotFound(false);
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
                    options={clients!}
                    getOptionLabel={(option) => option.name}
                    loadingText="Loading..."
                    openText="Open"
                    closeText="Close"
                    clearText="Clean"
                    value={
                      clients?.filter((client) => client.id === clientId)[0] ||
                      null
                    }
                    disabled
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
                      disabled
                      onChange={(date) => {}}
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
                    error={descriptionErr}
                    value={description}
                    disabled={isSubmitting || clientNotFound}
                    helperText={"Mandatory"}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setNoChanges(false);
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
                error={valueErr}
                value={value.toString()}
                disabled={isSubmitting || clientNotFound}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  val >= 0 && setValue(val);
                  setNoChanges(false);
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
                      disabled={isSubmitting || noChanges}
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

export default SaleEditModal;
