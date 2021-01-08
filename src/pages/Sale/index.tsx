import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import {
  Container,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";

import * as sale from "../../db/repositories/sales";
import * as client from "../../db/repositories/clients";

import DeleteModal from "../../components/DeleteModal";
import EditModal from "../../components/SalesEditModal";
import { useSnackbar } from "notistack";

interface ISale {
  id?: string;
  firstname: string;
  lastname: string;
  company: string;
  clientId: string;
  description: string;
  date: string;
  time: string;
  value: number;
  fullDate: string;
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

export default function SalesList() {
  const classes = useStyles();

  // Modal Controllers
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isloading, setLoading] = useState(false);

  // Some needed states
  const [refresh, setRefresh] = useState(true);
  const [saleDataToDelete, setSaleDataToDelete] = useState<ISale>();
  const [saleDataToEdit, setSaleDataToEdit] = useState<ISale>();
  const [saleToDeleteID, setSaleToDeleteID] = useState<string>();
  const [saleToEditID, setSaleToEditID] = useState<string>();
  const [sales, setSales] = useState<ISale[]>([]);

  // Fetch all sales when refresh or when the component mount
  useEffect(() => {
    fetchSales();
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

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
    setLoading(true);

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
          time: sale.date.split(" ")[4],
          date: `${sale.date.split(" ")[0]} ${sale.date.split(" ")[1]} ${
            sale.date.split(" ")[2]
          }`,
          fullDate: sale.date,
          firstname: saleClient.firstname,
          lastname: saleClient.lastname,
          company: saleClient.company,
        };
      }) as ISale[];

      // Sort Sales by date
      const sortedSales = parsedSales.sort((a, b) => {
        return (new Date(b.date)).getDate() - (new Date(a.date)).getDate();
      });

      // Set sales to state
      setSales(sortedSales);
      setLoading(false);
    } else {
      enqueueSnackbar(`Couldn't retrieve data`, {
        variant: "error",
      });
      setLoading(false);
    }
  }

  const remove = async (id: string) => {
    // Clean the sales state to prevent user double clicking the delete / edit button
    setSales([]);

    // Remove sale
    await sale.remove(id).catch((err) => {
      console.log(err);
      enqueueSnackbar(`Couldn't delete the sale`, {
        variant: "error",
      });
      return;
    });

    // Success
    enqueueSnackbar(`Sale removed successfully.`, {
      variant: "success",
    });

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

  return (
    <div className={classes.root}>
      <Layout />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {!isloading ? (
          <Container maxWidth="lg" className={classes.container}>
            {openDeleteModal && (
              <DeleteModal
                open={openDeleteModal}
                onClose={handleDeleteModalClose}
                dataToDelete={saleDataToDelete}
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
            )}
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
        ) : (
          <LinearProgress />
        )}
      </main>
    </div>
  );
}
