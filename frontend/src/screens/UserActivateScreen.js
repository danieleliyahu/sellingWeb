import React, { useEffect, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActivateUser } from "../actions/userActions";
const UserActivateScreen = () => {
  const { activation_token } = useParams();

  const userActivate = useSelector((state) => state.userActivate);
  const { loading, error, success, message } = userActivate;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ActivateUser(activation_token));
  }, [dispatch]);

  return (
    <div className="active_page">
      {loading && <LoadingBox></LoadingBox>}
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      {success && <MessageBox variant="success">{message}</MessageBox>}
    </div>
  );
};

export default UserActivateScreen;
