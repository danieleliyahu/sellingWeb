import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin, userInformation } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { dispatchLogin } from "../actions/tokenActions";
const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};
const SigninScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;
  const dispatch = useDispatch();
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(async () => {
    if (userInfo) {
      await Axios.post("/api/users/refresh_token");
      props.history.push(redirect);
      dispatch(userInformation());
    }
  }, [userInfo]);
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            placeholder="Enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>
        <div>
          <label />
          <div>
            New customer?{" "}
            <Link to={`/register?redirect=${redirect}`}>
              Create your account
            </Link>
          </div>
          <div>
            shop owner?{" "}
            <Link to={`/registerasseller?redirect=${redirect}`}>
              Start your own shop
            </Link>
            <div>
              <Link to={`/forgotpass?redirect=${redirect}`}>
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SigninScreen;
