import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./UserContext";
const UnprotectedRoute = ({ isAuth, component: Component, ...rest }) => {
  let { userType } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === true && userType === "user") {
          return (
            <Redirect
              to={{ pathname: "/polls", state: { from: props.location } }}
            />
          );
        } else if (isAuth === true && userType === "admin") {
          return (
            <Redirect
              to={{ pathname: "/create", state: { from: props.location } }}
            />
          );
        } else {
          return <Component />;
        }
      }}
    />
  );
};

export default UnprotectedRoute;
