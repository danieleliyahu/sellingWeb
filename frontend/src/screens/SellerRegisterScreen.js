import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sellerRegister } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "../axios.js";
import { validateEmail } from "../utils";
import { set } from "mongoose";
const SellerRegisterScreen = (props) => {
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
  const userRegister = useSelector((state) => state.sellerRegister);
  const { message, loading, error, success } = userRegister;
  console.log(userRegister);
  const dispatch = useDispatch();
  console.log(userRegister);
  console.log(success);
  const submitHandler = (e) => {
    e.preventDefault();
    // if(validateEmail(email)){
    //   return
    // }
    if (password !== confirmPassword) {
      alert("Password and confirm password are not match");
    } else {
      dispatch(
        sellerRegister(
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
  }, [message]);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads/logo", bodyFormData, {});

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
        {message && <MessageBox variant="success">{message}</MessageBox>}
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
          <label htmlFor="password">Password </label>
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

        <>
          <h2>Seller</h2>
          <div>
            <label htmlFor="sellerName">Shop name</label>
            <input
              id="sellerName"
              type="text"
              placeholder="Enter Seller Name"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="sellerLogo">shop Logo</label>
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
            <label htmlFor="sellerDescription">shop Description</label>
            <input
              id="sellerDescription"
              type="text"
              placeholder="Enter Seller Description"
              value={sellerDescription}
              onChange={(e) => setSellerDescription(e.target.value)}></input>
          </div>{" "}
        </>
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

export default SellerRegisterScreen;
