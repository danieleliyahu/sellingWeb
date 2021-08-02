import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="card productwidth removeborder" key={product._id}>
      <div className="homePageImage">
        <Link to={`/product/${product._id}`}>
          <img className="medium" src={product.image[0]} alt="product" />
        </Link>
      </div>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2 className="producttitle">{`${product.name} (${product.brand})`}</h2>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="row">
          <div className="price">${product.price}</div>
          <div>
            <Link to={`/seller/${product.seller._id}`}>
              {product.seller.seller.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
