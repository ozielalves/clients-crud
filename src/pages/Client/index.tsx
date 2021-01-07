import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import {
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import * as client from "../../db/repositories/clients";
import DeleteModal from "../../components/DeleteModal";
import EditModal from "../../components/EditModal";

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

export default function ClientsList() {
  const classes = useStyles();

  // Modal Controllers
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Some needed states
  const [refresh, setRefresh] = useState(true);
  const [clientDataToDelete, setClientDataToDelete] = useState<client.Client>();
  const [clientDataToEdit, setClientDataToEdit] = useState<client.Client>();
  const [clientToDeleteID, setClientToDeleteID] = useState<string>();
  const [clientToEditID, setClientToEditID] = useState<string>();
  const [clients, setClients] = useState<Array<client.Client>>([]);

  // Fetch all clients when refresh or when the component mount
  useEffect(() => {
    fetchClients();
    setRefresh(false);
  }, [refresh]);

  console.log("OPEN DEL MODAL: ", openDeleteModal); // PRINT

  // Set Client's data to be deleted
  useEffect(() => {
    if (clientToDeleteID) {
      setClientDataToDelete(
        clients.filter((client) => client.id === clientToDeleteID)[0]
      );
      setOpenDeleteModal(true);
    }
  }, [clientToDeleteID, setClientDataToDelete, clients]);

  // Set Client's data to be edited
  useEffect(() => {
    if (clientToEditID) {
      setClientDataToEdit(
        clients.filter((client) => client.id === clientToEditID)[0]
      );
      setOpenEditModal(true);
    }
  }, [clientToEditID, setClientDataToEdit, clients]);

  async function fetchClients() {
    // Clean the clients array first
    setClients([]);

    // Fetch clients from repository
    const _clients = await client.all();

    console.log("CLIENTS DATA: ", typeof _clients); // PRINT
    // Set clients to state
    setClients(_clients);
  }

  const remove = async (id: string) => {
    // Clean the clients state to prevent user double clicking the delete / edit button
    setClients([]);

    // Remove client
    await client.remove(id);

    // Closes the modal
    setOpenDeleteModal(false);

    // Ereases the deletion trigger
    setClientToDeleteID(undefined);

    // Fetch the clients again
    setRefresh(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setClientToDeleteID(undefined);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setClientToEditID(undefined);
  };

  return !refresh ? (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {openDeleteModal && (
            <DeleteModal
              open={openDeleteModal}
              onClose={handleDeleteModalClose}
              clientData={clientDataToDelete}
              remove={remove}
              onRefresh={setRefresh}
            />
          )}
          {openEditModal && (
            <EditModal
              open={openEditModal}
              onClose={handleEditModalClose}
              clientData={clientDataToEdit}
              onRefresh={setRefresh}
            />
          )}
          <Grid style={{ paddingBottom: 12 }} container>
            <Typography variant="h4" color="primary" align="left">
              Clients
            </Typography>
          </Grid>
          <Table
            dataToDisplay={clients}
            handleDeleteClient={setClientToDeleteID}
            handleEditClient={setClientToEditID}
          />
        </Container>
      </main>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
}
