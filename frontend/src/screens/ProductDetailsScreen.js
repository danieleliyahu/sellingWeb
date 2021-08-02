import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsProduct } from "../actions/productActions";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { productAnalysisInfo } from "../actions/analysisActions";
import Axios from "../axios.js";
const ProductDetailsScreen = (props) => {
  const productId = props.match.params.id;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productAnalysis = useSelector((state) => state.productAnalysis);
  const {
    loading: loadingAnalysis,
    error: errorAnalysis,
    productSold,
  } = productAnalysis;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(detailsProduct(productId));
    dispatch(productAnalysisInfo(productId));
  }, [dispatch, productId]);
  console.log(
    productSold && productSold.productSoldToday[0].qty,
    product && product.price
  );
  let productSoldToday = productSold && productSold.productSoldToday[0].qty;
  let productSoldAllTime = productSold && productSold.productSoldAllTime[0].qty;
  let moneyErendToday = product && product.price * productSoldToday;
  let moneyErendAllTime = product && product.price * productSoldAllTime;

  let productSoldTodayComperYesterday =
    productSold &&
    productSold.productSoldToday[0].qty -
      productSold.productSoldYesterDay[0].qty;
  return (
    <div>
      {console.log(productSold)}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <h1 className="title" style={{ fontSize: "6rem" }}>
            Product statistics
          </h1>
          <div className="row top ">
            <div className="col-2 productContainer">
              <ul className="card card-body " style={{ height: "fit-content" }}>
                <li>
                  <div className="p-1">
                    <h1>
                      {product.name} ({product.brand})
                    </h1>
                  </div>
                  <div className="row start">
                    <div className="p-1">
                      <Link to={`/product/${productId}`}>
                        <img
                          className="medium"
                          id="productdetailsimg"
                          src={product.image[0]}
                          alt={product.name}></img>
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}></Rating>
                </li>
                <li></li>
                <li>{product.description}</li>
              </ul>
            </div>
            <div className="reviewul col-1 productinfo">
              {" "}
              <ul>
                {console.log(product)}
                {product.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p className="comment">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            {productSold ? (
              <div>
                <h2 className="title">Sales</h2>

                <ul className="row summary">
                  <li>
                    <div className="summary-title color1">
                      <span className="textdeshbord">Items Sold Today</span>
                    </div>
                    <div className="summary-body">
                      <div className="comperdiv">
                        {productSoldTodayComperYesterday}
                        <span
                          className={
                            productSoldTodayComperYesterday > 0
                              ? `arrowUp`
                              : `arrowDown`
                          }>
                          {" "}
                          {productSoldTodayComperYesterday !== 0 && (
                            <i
                              className={
                                productSoldTodayComperYesterday > 0
                                  ? "fa fa-arrow-up"
                                  : "fa fa-arrow-down"
                              }></i>
                          )}
                        </span>
                      </div>
                      <div>{productSold.productSoldToday[0].qty}</div>
                    </div>
                  </li>
                  <li>
                    <div className="summary-title color3">
                      <span className="textdeshbord">Total Items Sold</span>
                    </div>
                    <div className="summary-body">{productSoldAllTime}</div>
                  </li>
                  <li>
                    <div className="summary-title color2">
                      <span className="textdeshbord">Today's Revenues</span>
                    </div>
                    <div className="summary-body">{`${moneyErendToday}$`}</div>
                  </li>
                  <li>
                    <div className="summary-title color3">
                      <span className="textdeshbord">Total Revenues</span>
                    </div>
                    <div className="summary-body">{moneyErendAllTime}$</div>
                  </li>
                </ul>
              </div>
            ) : (
              "no sales"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsScreen;
