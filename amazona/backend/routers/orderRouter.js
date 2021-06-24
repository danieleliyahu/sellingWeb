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
import { sendMail, sendMailWhenOrder } from "./sendMail.js";

const orderRouter = express.Router();
// give total orderd pieces of product
orderRouter.get(
  "/specificproduct/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const sellerProducts = await Product.find({ seller: req.user.id });
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
      const timeThatProductOrdered = {};
      timeThatProductOrdered.all = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
          $match: { "orderItems.product": ObjectId(productId) },
        },
        {
          $group: {
            _id: "$orderItems.name",
            total: { $sum: "$orderItems.qty" },
          },
        },
      ]);
      timeThatProductOrdered.paid = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
          $match: {
            $and: [
              { "orderItems.product": ObjectId(productId) },
              { isPaid: true },
            ],
          },
        },
        {
          $group: {
            _id: "$orderItems.name",
            total: { $sum: "$orderItems.qty" },
          },
        },
      ]);

      timeThatProductOrdered.notPaid =
        timeThatProductOrdered.all[0].total -
        timeThatProductOrdered.paid[0].total;
      res.json(timeThatProductOrdered);
    } catch (err) {
      res.status(404).send({ message: "no such producet" });
    }
  })
);
orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || "";
    const sellerFilter = seller ? { seller } : {};
    const orders = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    );

    //
    res.send(orders);
  })
);
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id });

    res.send(orders);
  })
);
orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({ productCategories, dailyOrders, users, orders });
  })
);
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("a");

    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      // req.body.orderItems[0].image = req.body.orderItems[0].image[0];
      // req.body.orderItems[1].image = req.body.orderItems[1].image[0];
      console.log(req.body);
      for (let i = 0; i < req.body.orderItems.length; i++) {
        req.body.orderItems[i].image = req.body.orderItems[i].image[0];
      }
      console.log("c");

      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user.id,
      });

      const createdOrder = await order.save();

      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    // const order = await Order.findById(req.user.id);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log(req.user, "aaaaaaaaaaaaaaaa");

    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    console.log(order, "bbbbbbbbbbbbbbbbbbbb");
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      console.log(order, "cccccccccccccccccc");

      const updatedOrder = await order.save();
      console.log(order, "ddddddddddddddddddd");

      // payOrderEmailTemplate(order)
      console.log(order.user.email, "sssssssssssss");

      sendMailWhenOrder(order.user.email, order);
      // sendMail(order.user.email, "asdasdsa", "sdsadsadasdsa");
      console.log(order.user.email, "ddddddddddddddddddd");

      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: "Order Delivered", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
