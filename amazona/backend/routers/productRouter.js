import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAdmin, isAuth, isSellerOrAdmin, isSeller } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const order = req.query.order || "";
    const name = req.query.name || "";
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
    const category = req.query.category || "";
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: -1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller", "name logo")
      .sort(sortOrder);
    res.send(products);
  })
);
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createProducts = await Product.insertMany(products);
      res.send({ createProducts });
    } else {
      res
        .status(500)
        .send({ message: "No seller found. first run /api/users/seed" });
    }
  })
);
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({})
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name logo rating numReviews "
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample name" + Date.now(),
      seller: req.user._id,
      image: "/imeges/p1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const createdProduct = await product.save();
    res.send({ message: "Product Created", product: createdProduct });
  })
);
productRouter.put(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updateProduct = await product.save();
      res.send({ message: "Product Update", product: updateProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.review.push(review);
      product.numReviews = product.review.length;
      product.rating =
        product.review.reduce((a, c) => c.rating + a, 0) /
        product.review.length;
      res.status(201).send({
        message: "Review Created",
        review: updateProduct.review[updatedProduct.review.length - 1],
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
export default productRouter;
