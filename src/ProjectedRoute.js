import React from "react";
import { Route, Redirect } from "react-router-dom";
import Navbar from "./afterLogin/Navbar";
import { useContext } from "react";
import { UserContext } from "./UserContext";
const ProtectedRoute = ({ isAuth, component: Component, ...rest }) => {
  let { userType } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === true && userType === "user") {
          return (
            <>
              <Navbar />
              <Component />
            </>
          );
        } else if (isAuth === true && userType === "admin") {
          return (
            <Redirect
              to={{ pathname: "/create", state: { from: props.location } }}
            />
          );
        } else {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
