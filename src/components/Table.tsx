import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

interface ITable {
  dataToDisplay: any;
  handleDeleteClient?: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleEditClient?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface ClientColumn {
  id:
    | "name"
    | "email"
    | "company"
    | "credit"
    | "debt"
    | "editButtonID"
    | "deleteButtonID";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: ClientColumn[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "company",
    label: "Company",
    minWidth: 170,
  },
  {
    id: "credit",
    label: "Credit\u00a0($)",
    minWidth: 60,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "debt",
    label: "Debt\u00a0($)",
    minWidth: 60,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
  {
    id: "editButtonID",
    label: "",
    minWidth: 10,
    align: "right",
  },
  { id: "deleteButtonID", label: "", minWidth: 10 },
];

interface ClientData {
  name: string;
  email: string;
  company: string;
  credit: number;
  debt: number;
  editButtonID: string;
  deleteButtonID: string;
}

function createClientData(
  firstname: string,
  lastname: string,
  email: string,
  company: string,
  credit: number,
  debt: number,
  editButtonID: string,
  deleteButtonID: string
): ClientData {
  return {
    name: `${firstname} ${lastname}`,
    email,
    company,
    credit,
    debt,
    editButtonID,
    deleteButtonID,
  };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 550,
  },
});

const StickyHeadTable = ({
  dataToDisplay,
  handleDeleteClient,
  handleEditClient,
}: ITable) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  
  // Create the array of objects to be displayed
  const rowsToSort = dataToDisplay.map((item: any) => {
    return createClientData(
      item.firstname,
      item.lastname,
      item.email,
      item.company,
      item.credit,
      item.debt,
      `e ${item.id}`,
      `d ${item.id}`
    );
  });

  // Sorts the array in alphabetical order based on the key names
  const rows = rowsToSort.sort((a: any,b: any) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0)); 

  console.log("ROW: ", rows); // PRINT
  console.log("Data CLients on Table: ", dataToDisplay); // PRINT

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : typeof value === "string" &&
                            value.split(" ")[0] === "e" ? ( // Client's ID (Edit trigger)
                            <IconButton
                              onClick={() =>
                                handleEditClient &&
                                handleEditClient(value.split(" ")[1])
                              }
                              color="primary"
                              aria-label="edit client"
                              component="span"
                              style={{ padding: "5px" }}
                            >
                              <EditIcon />
                            </IconButton>
                          ) : typeof value === "string" &&
                            value.split(" ")[0] === "d" ? ( // Client's ID (Delete trigger)
                            <IconButton
                              onClick={() =>
                                handleDeleteClient &&
                                handleDeleteClient(value.split(" ")[1])
                              }
                              color="primary"
                              aria-label="delete client"
                              component="span"
                              style={{ padding: "5px" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7, 14, 28, 56]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StickyHeadTable;
