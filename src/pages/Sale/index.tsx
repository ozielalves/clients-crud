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

import * as sale from "../../db/repositories/sales";
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

export default function SalesList() {
  const classes = useStyles();

  // Modal Controllers
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Some needed states
  const [refresh, setRefresh] = useState(true);
  const [saleDataToDelete, setSaleDataToDelete] = useState<sale.Sale>();
  const [saleDataToEdit, setSaleDataToEdit] = useState<sale.Sale>();
  const [saleToDeleteID, setSaleToDeleteID] = useState<string>();
  const [saleToEditID, setSaleToEditID] = useState<string>();
  const [sales, setSales] = useState<Array<sale.Sale>>([]);

  // Fetch all sales when refresh or when the component mount
  useEffect(() => {
    fetchSales();
    setRefresh(false);
  }, [refresh]);

  console.log("OPEN DEL MODAL: ", openDeleteModal); // PRINT

  // Set Sale's data to be deleted
  useEffect(() => {
    if (saleToDeleteID) {
      setSaleDataToDelete(
        sales.filter((sale) => sale.id === saleToDeleteID)[0]
      );
      setOpenDeleteModal(true);
    }
  }, [saleToDeleteID, setSaleDataToDelete, sales]);

  // Set Sale's data to be edited
  useEffect(() => {
    if (saleToEditID) {
      setSaleDataToEdit(sales.filter((sale) => sale.id === saleToEditID)[0]);
      setOpenEditModal(true);
    }
  }, [saleToEditID, setSaleDataToEdit, sales]);

  async function fetchSales() {
    // Clean the sales array first
    setSales([]);

    // Fetch sales from repository
    const _sales = await sale.all();

    console.log("SALES DATA: ", typeof _sales); // PRINT
    // Set sales to state
    setSales(_sales);
  }

  const remove = async (id: string) => {
    // Clean the sales state to prevent user double clicking the delete / edit button
    setSales([]);

    // Remove sale
    await sale.remove(id);

    // Closes the modal
    setOpenDeleteModal(false);

    // Ereases the deletion trigger
    setSaleToDeleteID(undefined);

    // Fetch the sales again
    setRefresh(true);
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setSaleToDeleteID(undefined);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setSaleToEditID(undefined);
  };

  return !refresh ? (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {/* {openDeleteModal && (
            <DeleteModal
              open={openDeleteModal}
              onClose={handleDeleteModalClose}
              saleData={saleDataToDelete}
              remove={remove}
              onRefresh={setRefresh}
            />
          )}
          {openEditModal && (
            <EditModal
              open={openEditModal}
              onClose={handleEditModalClose}
              saleData={saleDataToEdit}
              onRefresh={setRefresh}
            />
          )} */}
          <Grid style={{ paddingBottom: 12 }} container>
            <Typography variant="h4" color="primary" align="left">
              Sales
            </Typography>
          </Grid>
          <Table
            dataSales={sales}
            handleDelete={setSaleToDeleteID}
            handleEdit={setSaleToEditID}
          />
        </Container>
      </main>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
}
