import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from "../constants/productConstants";

export default function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();

  const sellerMode = props.match.path.indexOf("/seller") >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : "", pageNumber })
    );
  }, [dispatch, successDelete, props.history, pageNumber]);

  const deleteHandler = (product) => {
    if (window.confirm("Are you sure you want to delete?"))
      dispatch(deleteProduct(product._id));
  };
  const createHandler = () => {
    props.history.push(`/postproduct`);
  };
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    if (!window.location.pathname.includes("seller")) {
      return `/productlist/pageNumber/${filterPage}`;
    } else {
      return `/productlist/seller/pageNumber/${filterPage}`;
    }
  };
  return (
    <div>
      <div className="row">
        <h1>Products</h1>
        <button type="button" className="primary" onClick={createHandler}>
          Create Product
        </button>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}>
                    Delete
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/details`)
                    }>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="row center pagination">
        {[...Array(pages).keys()].map((x) => (
          <Link
            className={x + 1 === page ? "active" : ""}
            key={x + 1}
            to={getFilterUrl({ page: x + 1 })}>
            {x + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
