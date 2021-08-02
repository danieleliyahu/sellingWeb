import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const AdminRoute = ({ component: Component, ...rest }) => {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
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
