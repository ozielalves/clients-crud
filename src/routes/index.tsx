import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import ClientRegister from "../pages/Client/Register";
import SaleRegister from "../pages/Sale/Register";
import SaleList from "../pages/Sale";
import ClientsList from "../pages/Client";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Dashboard} path="/" exact />
      <Route component={ClientRegister} path="/client/register" />
      <Route component={SaleRegister} path="/sale/register" />
      <Route component={ClientsList} path="/clients" />
      <Route component={SaleList} path="/sales" />
    </BrowserRouter>
  );
};

export default Routes;