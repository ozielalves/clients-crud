import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { List } from "@material-ui/core";

export const MainListItems = () => {
  return (
    <List>
      <ThemeLink to="/">
        <ListItem button>
          <ThemeListIcon>
            <DashboardIcon />
          </ThemeListIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </ThemeLink>
      <ThemeLink to="/">
        <ListItem button>
          <ThemeListIcon>
            <AddShoppingCartIcon />
          </ThemeListIcon>
          <ListItemText primary="New Sale" />
        </ListItem>
      </ThemeLink>
      <ThemeLink to="/">
        <ListItem button>
          <ThemeListIcon>
            <ShoppingCartIcon />
          </ThemeListIcon>
          <ListItemText primary="Sales" />
        </ListItem>
      </ThemeLink>
      <ThemeLink to="/client/register">
        <ListItem button>
          <ThemeListIcon>
            <GroupAddIcon />
          </ThemeListIcon>
          <ListItemText primary="New Client" />
        </ListItem>
      </ThemeLink>
      <ThemeLink to="/clients">
        <ListItem button>
          <ThemeListIcon>
            <PeopleIcon />
          </ThemeListIcon>
          <ListItemText primary="Clients" />
        </ListItem>
      </ThemeLink>
    </List>
  );
};

const ThemeListIcon = styled(ListItemIcon)`
  color: #00695c;
`;

const ThemeLink = styled(Link)`
  color: #00695c;
  text-decoration: none;
`;
