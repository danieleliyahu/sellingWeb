import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import {
  addMissingHours,
  dailyOrdersFunc,
  dailyOrdersSellerFunc,
  formatDate,
  formatDateAddMonth,
  formatDateLastMonth,
  formatDateThisMonth,
  moneySellerMade,
  moneySellerMadeAllTime,
  productSoldAllTime,
  productSoldTodayAndYesterday,
  ThisMonthDaily,
} from "../analysisUtils.js";

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import {
  isAdmin,
  isAuth,
  isSeller,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from "../utils.js";
const analysisRouter = express.Router();
const yesterday = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
);
const todayDate = formatDate(new Date());
const thisMonth = formatDateThisMonth(new Date());
const lastMonth = formatDateLastMonth(new Date());

const lastweek = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
);
const before2Weeks = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 14)
);
// time that a spasific product get sold today
analysisRouter.get(
  "/sellerorder/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const sellerProducts = await Order.find({ seller: req.user.id });
    if (req.isSeller && !req.isAdmin) {
      const found = sellerProducts.find((product) => product._id == productId);
      if (found) {
        res.send(true);
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  })
);
analysisRouter.get(
  "/order/:id",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const sellerProducts = await Product.find({ seller: req.user.id })
      .then((products) => {
        return products;
      })
      .catch((err) => {
        return res.status(404).send("sory you dont own this product");
      });
    if (req.isSeller && !req.isAdmin) {
      const found = sellerProducts.find((product) => product._id == productId);
      if (found === undefined) {
        return res
          .status(404)
          .send({ message: "sory you dont own this product" });
      }
    }
    try {
      const productSold = {};
      (productSold["productSoldToday"] = await productSoldTodayAndYesterday(
        todayDate,
        productId
      )),
        (productSold["productSoldYesterDay"] =
          await productSoldTodayAndYesterday(todayDate, productId, yesterday)),
        (productSold["productSoldAllTime"] = await productSoldAllTime(
          productId
        )),
        // (productSold["moneyMadeToday"] = await moneySellerMade(
        //   todayDate,
        //   req.user.id
        // )),
        // (productSold["moneyMadeYesterday"] = await moneySellerMade(
        //   todayDate,
        //   req.user.id,
        //   yesterday
        // )),
        // (productSold["moneyMadeLastWeek"] = await moneySellerMade(
        //   lastweek,
        //   req.user.id
        // )),
        // (productSold["moneyMadeBefore2Weeks"] = await moneySellerMade(
        //   lastweek,
        //   req.user.id,
        //   before2Weeks
        // )),
        res.send(productSold);
    } catch (err) {
      res.status(404).send({ message: "no such producet" });
    }
  })
);
analysisRouter.get(
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

    const ThisMonthDailyOrders = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(thisMonth),
            // $lt: new Date(thisMonth),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },

      { $sort: { _id: 1 } },
    ]);
    const lastMonthDailyOrders = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(lastMonth),
            $lt: new Date(thisMonth),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      // {
      //   $match: {
      //     _id: {
      //       $gte: lastMonth,
      //       $lt: thisMonth,
      //     },
      //   },
      // },
      { $sort: { _id: 1 } },
    ]);
    console.log(lastMonthDailyOrders);
    lastMonthDailyOrders.map((lastMonthDailyOrder) => {
      lastMonthDailyOrder._id = formatDateAddMonth(
        new Date(lastMonthDailyOrder._id)
      );
    });
    console.log(lastMonthDailyOrders);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(lastMonthDailyOrders);
    console.log(ThisMonthDailyOrders);

    res.send({
      productCategories,
      lastMonthDailyOrders,
      ThisMonthDailyOrders,
      users,
      orders,
    });
  })
);
// money seller made
analysisRouter.get(
  "/sellerMoney",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const moneyMade = {};

      (moneyMade["moneyMadeToday"] = await moneySellerMade(
        todayDate,
        req.user.id
      )),
        (moneyMade["moneyMadeYesterday"] = await moneySellerMade(
          todayDate,
          req.user.id,
          yesterday
        )),
        (moneyMade["moneyMadeLastWeek"] = await moneySellerMade(
          lastweek,
          req.user.id
        )),
        (moneyMade["lastMonth"] = await moneySellerMade(
          thisMonth,
          req.user.id
        )),
        (moneyMade["allTime"] = await moneySellerMadeAllTime(req.user.id)),
        console.log(moneyMade);

      res.send(moneyMade);
    } catch (err) {
      res.status(404).send({ message: "not promision" });
    }
  })
);
// orders per hour today and yesterday
analysisRouter.get(
  "/salesperhour",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
      let dailyOrders = {};
      if (req.isAdmin) {
        dailyOrders["dailyOrdersToday"] = await dailyOrdersFunc(todayDate);

        dailyOrders["dailyOrdersYesterDay"] = await dailyOrdersFunc(yesterday);
      } else {
        dailyOrders["dailyOrdersToday"] = await dailyOrdersFunc(
          todayDate,
          userId
        );

        dailyOrders["dailyOrdersYesterDay"] = await dailyOrdersFunc(
          yesterday,
          userId
        );
      }
      dailyOrders["dailyOrdersToday"] = await addMissingHours(
        dailyOrders,
        "dailyOrdersToday"
      );
      console.log(dailyOrders);

      dailyOrders["dailyOrdersYesterDay"] = await addMissingHours(
        dailyOrders,
        "dailyOrdersYesterDay"
      );
      res.send(dailyOrders);
    } catch (err) {
      res.status(404).send({ message: err });
    }
  })
);
// sales per hour of saller
analysisRouter.get(
  "/salesperhourSeller",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      let dailyOrders = {};

      dailyOrders["dailyOrdersToday"] = await dailyOrdersSellerFunc(
        todayDate,
        req.user.id
      );

      dailyOrders["dailyOrdersYesterDay"] = await dailyOrdersSellerFunc(
        yesterday,
        req.user.id
      );

      dailyOrders["dailyOrdersToday"] = await addMissingHours(
        dailyOrders,
        "dailyOrdersToday"
      );
      dailyOrders["dailyOrdersYesterDay"] = await addMissingHours(
        dailyOrders,
        "dailyOrdersYesterDay"
      );
      res.send(dailyOrders);
    } catch (err) {
      res.status(404).send({ message: err });
    }
  })
);
analysisRouter.get(
  "/sallermoneymonth",
  isAuth,
  isSeller,
  expressAsyncHandler(async (req, res) => {
    const sellerId = req.user.id;
    try {
      const monthly = await ThisMonthDaily(thisMonth, sellerId, lastMonth);
      console.log(monthly);
      res.send(monthly);
    } catch (err) {
      res.status(404).send({ message: "no such seller" });
    }
  })
);
export default analysisRouter;
