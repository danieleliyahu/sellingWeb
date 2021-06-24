import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from "../utils.js";
const analysisRouter = express.Router();

analysisRouter.get(
  "/order/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const sellerProducts = await Order.find({ seller: req.user.id });
    if (req.isSeller && !req.isAdmin) {
      const found = sellerProducts.find((product) => product._id == productId);
      if (found === undefined) {
        return res
          .status(404)
          .send({ message: "sory you dont own this product" });
      }
    }
    const ObjectId = mongoose.Types.ObjectId;
    try {
      const orderAvg = await Order.aggregate([
        {
          $match: {
            timestamp: {
              $gte: updateAt,
            },
          },
        },
      ]);
    } catch (err) {
      res.status(404).send({ message: "no such producet" });
    }
  })
);

export default analysisRouter;
