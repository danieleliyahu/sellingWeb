import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../axios.js";
import { createProduct } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

export default function ProductPostScreen(props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/productlist/seller`);
    }
  }, [dispatch, createdProduct, props.history, successCreate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // TODO: dispatch update product
    dispatch(
      createProduct({
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      })
    );
  };
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(data);
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
          <h1>Post Product </h1>
        </div>
        {loadingCreate && <LoadingBox></LoadingBox>}
        {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="text"
              placeholder="Enter image"
              value={image}
              onChange={(e) => setImage(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="imageFile">Image File</label>
            <input
              type="file"
              id="imageFile"
              label="Choose Image"
              onChange={uploadFileHandler}></input>
            {loadingUpload && <LoadingBox></LoadingBox>}
            {errorUpload && (
              <MessageBox variant="danger">{errorUpload}</MessageBox>
            )}
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              required
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              type="text"
              required
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="countInStock">Count In Stock</label>
            <input
              id="countInStock"
              required
              type="number"
              placeholder="Enter countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}></input>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              required
              rows="3"
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label></label>
            <button className="primary" type="submit">
              Post
            </button>
          </div>
        </>
      </form>
    </div>
  );
}
