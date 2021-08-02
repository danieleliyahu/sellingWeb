import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { validateEmail } from "../utils";
import { set } from "mongoose";
import { forgot, reset } from "../actions/userActions";
import Cookies from "js-cookie";
const ResetPassScreen = (props) => {
  const accessToken = props.match.params.accessToken;
  Cookies.set("accessToken", accessToken, { expires: 1 });

  const [password, setPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const resetPassword = useSelector((state) => state.resetPassword);
  const { message, loading, error, success } = resetPassword;
  console.log(resetPassword);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    // if(!validateEmail(email)){
    //   return
    // }

    dispatch(reset(password));
  };
  useEffect(() => {
    if (success) {
      setPassword("");
    }
  }, [message]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Reset password</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {message && <MessageBox variant="success">{message}</MessageBox>}

        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}></input>
        </div>

        <div>
          <label />
          <button className="primary" type="submit">
            Send
          </button>
        </div>
        <div>
          <label />
          <div>
            Already have an account?{" "}
            <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassScreen;
