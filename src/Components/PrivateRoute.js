import React from "react";
import { Route } from "react-router-dom";
import { history, onAuth } from "../libs/services";

const PrivateRoute = ({ Component, ...rest }) => {
  const userData = onAuth((data) => data);

  console.log(userData);
  return (
    <Route
      {...rest}
      element={(props) => {
        if (!userData) return history.replace("/auth");

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
