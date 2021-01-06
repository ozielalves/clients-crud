import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import BiForm from "../components/BiForm";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Dashboard} path="/" exact />
      <Route component={BiForm} path="/client/register" />
    </BrowserRouter>
  );
};

export default Routes;