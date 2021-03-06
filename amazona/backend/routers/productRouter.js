import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || "";
    const category = req.query.category || "";
    const seller = req.query.seller || "";
    const order = req.query.order || "";
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 };
    const count = await Product.countDocuments({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    // const seller = await User.findOne({ isSeller: true });
    // if (seller) {
    //   const products = data.products.map((product) => ({
    //     ...product,
    //     seller: seller._id,
    //   }));
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
    // } else {
    //   res
    //     .status(500)
    //     .send({ message: "No seller found. first run /api/users/seed" });
    // }
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "seller",
        "seller.name seller.logo seller.rating seller.numReviews"
      );
      res.send(product);
    } catch (err) {
      res.status(404).send({ message: "Product Not Found" });
    }
    //   console.log(product);
    //   if (product) {
    //   } else {
    //   }
    // })
  })
);

productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    let { name, image, price, countInStock, category, brand, description } =
      req.body.productInfo;
    if (name && image && price && category && brand && description) {
      category = category.toLowerCase();
      const product = new Product({
        name,
        seller: req.user.id,
        image,
        price,
        category,
        brand,
        countInStock,
        rating: 0,
        numReviews: 0,
        description,
      });
      const createdProduct = await product.save();
      res.send({ message: "Product Created", product: createdProduct });
    } else {
      res.status(400).send({ message: "You Most file all " });
    }
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
      const updatedProduct = await product.save();
      res.send({ message: "Product Updated", product: updatedProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    console.log(product._id, req.user.id);
    if (product) {
      if (req.isSeller && !req.isAdmin) {
        if (product.seller === req.user.id) {
          return res
            .status(404)
            .send({ message: "sory you dont own this product" });
        }
        const deleteProduct = await product.remove();
        res.send({ message: "Product Deleted", product: deleteProduct });
      } else {
        const deleteProduct = await product.remove();
        res.send({ message: "Product Deleted", product: deleteProduct });
      }
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
      const user = await User.findById(req.user.id);
      console.log(user);

      const review = {
        userId: req.user.id,
        name: user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => Number(c.rating) + a, 0) /
        product.numReviews;

      const updatedProduct = await product.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
