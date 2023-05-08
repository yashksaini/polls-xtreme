import React from "react";
import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./UserContext";

const AdminRoute = ({ isAuth, component: Component, ...rest }) => {
  let { userType } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === true && userType === "admin") {
          return <Component />;
        } else {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default AdminRoute;
