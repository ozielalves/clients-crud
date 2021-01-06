import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useHistory } from "react-router-dom";
import { List } from "@material-ui/core";

export const MainListItems = () => {
  const history = useHistory();
  return (
    <List>
      <ListItem button onClick={() => history.push("/")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AddShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="New Sale" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Sales" />
      </ListItem>
      <ListItem button onClick={() => history.push("/client/register")}>
        <ListItemIcon>
          <GroupAddIcon />
        </ListItemIcon>
        <ListItemText primary="New Client" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Clients" />
      </ListItem>
    </List>
  );
};
