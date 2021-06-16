import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { validateEmail } from "../utils";
import { set } from "mongoose";
const RegisterScreen = (props) => {
  console.log(window.location.href);
  console.log(window.location.pathname);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerLogo, setSellerLogo] = useState("");
  const [sellerDescription, setSellerDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";
  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error, success } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    // if(validateEmail(email)){
    //   return
    // }
    if (password !== confirmPassword) {
      alert("Password and confirm password are not match");
    } else {
      dispatch(
        register(
          name,
          email,
          password,
          confirmPassword,
          sellerName,
          sellerLogo,
          sellerDescription
        )
      );
    }
  };
  useEffect(() => {
    console.log(success);
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setSellerName("");
      setSellerLogo("");
      setSellerDescription("");
      setConfirmPassword("");
      // props.history.push(redirect);
    }
  }, [userInfo]);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads/logo", bodyFormData, {});
      console.log(data);
      setSellerLogo(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Create Account</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        {userInfo && <MessageBox variant="success">{userInfo}</MessageBox>}
        <div>
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}></input>
        </div>
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
          <label htmlFor="password">Password address</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            required
            value={confirmPassword}
            placeholder="Enter confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}></input>
        </div>
        {window.location.pathname === "/registerasseller" && (
          <>
            <h2>Seller</h2>
            <div>
              <label htmlFor="sellerName">Seller Name</label>
              <input
                id="sellerName"
                type="text"
                placeholder="Enter Seller Name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}></input>
            </div>
            <div>
              <label htmlFor="sellerLogo">Seller Logo</label>
              <input
                id="sellerLogo"
                type="file"
                placeholder="Enter Seller Logo"
                onChange={uploadFileHandler}></input>
            </div>
            {loadingUpload && <LoadingBox></LoadingBox>}
            {errorUpload && (
              <MessageBox variant="danger">{errorUpload}</MessageBox>
            )}
            <div>
              <label htmlFor="sellerDescription">Seller Description</label>
              <input
                id="sellerDescription"
                type="text"
                placeholder="Enter Seller Description"
                value={sellerDescription}
                onChange={(e) => setSellerDescription(e.target.value)}></input>
            </div>{" "}
          </>
        )}
        <div>
          <label />
          <button className="primary" type="submit">
            Register
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

export default RegisterScreen;
