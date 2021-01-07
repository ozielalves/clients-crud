import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import ClientRegister from "../pages/Client/Register";
import ClientsList from "../pages/Client";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Dashboard} path="/" exact />
      <Route component={ClientRegister} path="/client/register" />
      <Route component={ClientsList} path="/clients" />
    </BrowserRouter>
  );
};

export default Routes;