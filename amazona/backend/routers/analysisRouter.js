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
    console.log(productId);

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
    // console.log(new Date());

    try {
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d-%H", date: "$createdAt" },
            },
            orders: { $sum: 1 },
            sales: { $sum: "$totalPrice" },
          },
        },
        {
          $match: {
            _id: {
              $gte: "2021-06-26",
              // $lt: "2021-06-25",
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      for (let i = 0; i <= 24; i++) {
        if (i < 10 && !dailyOrders[i]) {
          // dailyOrders[2] = { _id: `2021-06-26-0${2}` };
          dailyOrders[i] = { _id: `2021-06-26-0${i}`, orders: 0, sales: 0 };
          // dailyOrders[i].orders = 0;
          // dailyOrders[i].sales = 0;
        }
        if (i >= 10 && !dailyOrders[i]) {
          dailyOrders[i] = { _id: `2021-06-26-${i}`, orders: 0, sales: 0 };
        }
      }
      console.log(dailyOrders);
      // const orderAvg = await Order.aggregate([
      //   {
      //     $match: {
      //       createdAt: {
      //         $gte: "2021-06-24T00:00:00.00+00:00",
      //         $lt: "2021-06-25T00:00:00.00+00:00",
      //       },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: { $hour: "$createdAt" },
      //       count: { $sum: 1 },
      //     },
      //   },
      //   {
      //     $sort: {
      //       _id: 1,
      //     },
      //   },
      // ]);
      // console.log(orderAvg);
      res.send(dailyOrders);
    } catch (err) {
      res.status(404).send({ message: err });
    }
  })
);

export default analysisRouter;
