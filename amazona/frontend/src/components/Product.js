import React from 'react'
import Rating from './Rating'

const Product = ({product}) => {
    return (
        <div className="card" key={product._id}>
        <a href={`/product/${product._id}`}>
            <img className="medium" src={product.image} alt="product"/>
        </a>
        <div className="card-body">
            <a href={`/product/${product._id}`}>
                <h2>{product.name}</h2>
            </a>
            <Rating rating={product.rating} numReviews={product.numReviews} />
            <div className="price"> ${product.price}</div>
        </div>
    </div>
    )
}

export default Product
