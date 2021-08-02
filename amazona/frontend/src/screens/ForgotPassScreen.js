import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { validateEmail } from "../utils";
import { set } from "mongoose";
import { forgot } from "../actions/userActions";
const ForgotPassScreen = (props) => {
  const [email, setEmail] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const forgotPassword = useSelector((state) => state.forgotPassword);
  const { message, loading, error, success } = forgotPassword;
  console.log(forgotPassword);
  const dispatch = useDispatch();
  console.log(forgotPassword);
  const submitHandler = (e) => {
    e.preventDefault();
    // if(!validateEmail(email)){
    //   return
    // }

    dispatch(forgot(email));
  };
  useEffect(() => {
    if (success) {
      setEmail("");
    }
  }, [message]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>forget password</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {message && <MessageBox variant="success">{message}</MessageBox>}

        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}></input>
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

export default ForgotPassScreen;
