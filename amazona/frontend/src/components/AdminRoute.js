import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const AdminRoute = ({ component: Component, ...rest }) => {
  const userInformation = useSelector((state) => state.userInformation);
  const { userInfo } = userInformation;
  console.log(userInformation);
  {
    console.log(userInfo);
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        userInfo && userInfo.isAdmin ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/signin" />
        )
      }></Route>
  );
};

export default AdminRoute;
