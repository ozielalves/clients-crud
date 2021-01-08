import {
  Box,
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Theme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Close } from "@material-ui/icons";
import { ReactComponent as WarningIcon } from "../assets/warning_amber_24px.svg";
import { useHistory } from "react-router-dom";
/* import { Client } from "../db/repositories/clients";

interface DeleteSale {
  id?: string;
  firstname: string;
  lastname: string;
  company: string;
  clientId: string;
  description: string;
  date: string;
  value: number;
} */

interface props {
  open: boolean;
  onClose: () => void;
  dataToDelete: any;
  onRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  remove: (id: string) => Promise<void>;
}

const DeleteModal = ({
  open,
  onClose,
  dataToDelete,
  onRefresh,
  remove,
}: props) => {
  const [comfirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>();
  const history = useHistory();

  useEffect(() => {
    if (comfirmDelete && dataToDelete) {
      setConfirmDelete(false);
      remove(dataToDelete.id!);
      onClose();
      onRefresh(true);
    }
  }, [comfirmDelete, dataToDelete, onRefresh, onClose, history, remove]);

  // Client Full name
  useEffect(() => {
    if (dataToDelete) {
      setClientName(
        dataToDelete?.firstname &&
          dataToDelete?.lastname &&
          `${dataToDelete?.firstname} ${dataToDelete?.lastname}`
      );
    }
  }, [dataToDelete, setClientName]);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        position: "absolute",
        width: 583,
        height: 311,
        zIndex: 9999999,
        backgroundColor: theme.palette.background.paper,
        border: "none",
        borderRadius: "10px",
        padding: theme.spacing(2, 4, 0),
        outline: "none !important",
      },
      dialog: {
        minHeight: "311px",
        maxHeight: "311px",
        maxWidth: "583px",
        minWidth: "583px",
      },
      root: {
        padding: "0",
      },
    })
  );

  function getModalStyle() {
    const top = 51;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-50%, -${left}%)`,
    };
  }

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid
          container
          style={modalStyle}
          className={classes.paper}
          direction="column"
          justify="space-between"
          spacing={1}
        >
          <Grid item container alignItems="flex-start" spacing={1}>
            <Grid item container spacing={1}>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ width: "100%" }}
              >
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Box>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              style={{ paddingLeft: 108 }}
              spacing={1}
            >
              <Grid item>
                <WarningIcon />
              </Grid>
              <Grid item>
                <Title>
                  {dataToDelete?.value
                    ? "Delete this Sale?"
                    : "Delete this Client?"}
                </Title>
              </Grid>
            </Grid>
            <Grid item container>
              <Body1>
                {dataToDelete?.value
                  ? `Upon confirming the sale to ${clientName} of the company ${dataToDelete?.company} on ${dataToDelete?.date} will be deleted from the database.`
                  : `Upon confirming the client "${clientName}" will be deleted from the database.`}
              </Body1>
            </Grid>
          </Grid>
          <Grid item container spacing={4} justify="flex-end">
            <Grid item>
              <TextActionButton
                variant="text"
                color="primary"
                onClick={onClose}
                disableElevation
              >
                Cancel
              </TextActionButton>
            </Grid>
            <Grid item>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </ActionButton>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

const Title = styled.h2`
  color: black;
`;

const Body1 = styled.p``;

const TextActionButton = styled(Button)`
  height: 35px;
  width: 100px;
  /* border-radius: 6px; */
  padding: 9px, 20px;
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  height: 35px;
  width: 100px;
  border-radius: 6px;
  padding: 9px, 20px;
  margin-bottom: 20px;
`;

export default DeleteModal;
