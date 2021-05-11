import React from 'react'
import Raiting from './Raiting'

const Product = ({product}) => {
    return (
        <div className="card" key={product._id}>
        <a href={`/product/${product._id}`}>
            <img className="medium" src={product.image} alt="product"/>
        </a>
        <div className="card-body">
            <a href="product.html">
                <h2>{product.name}</h2>
            </a>
            <Raiting rating={product.rating} numReviews={product.numReviews} />
            <div className="price"> ${product.price}</div>
        </div>
    </div>
    )
}

export default Product
