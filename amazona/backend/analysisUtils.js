import mongoose from "mongoose";
import Order from "./models/orderModel.js";

export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
export function formatDateLastMonth(date) {
  var d = new Date(date),
    month = "" + d.getMonth(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;

  return [year, month].join("-");
}
export function formatDateThisMonth(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;

  return [year, month].join("-");
}
export function formatDateAddMonth(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 2),
    day = "" + d.getDate(),
    year = d.getFullYear();
  console.log(day);
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
const yesterday = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
);
const todayDate = formatDate(new Date());

const lastweek = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
);
const before2Weeks = formatDate(
  new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 14)
);
export const ThisMonthDaily = async (thisMonth, sellerId, lastMonth) => {
  const ObjectId = mongoose.Types.ObjectId;
  const monthly = {};
  monthly["ThisMonthDailyOrders"] = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(thisMonth),
        },
        seller: ObjectId(sellerId),
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        orders: { $sum: 1 },
        sales: { $sum: "$totalPrice" },
      },
    },
    // { $match: { seller: ObjectId(sellerId) } },
    { $sort: { _id: 1 } },
  ]);
  monthly["lastMonthDailyOrders"] = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        createdAt: {
          $gte: new Date(lastMonth),
          $lt: new Date(thisMonth),
        },
        seller: ObjectId(sellerId),
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
  return monthly;
};
export const productSoldTodayAndYesterday = async (date, productId, before) => {
  const ObjectId = mongoose.Types.ObjectId;
  let x;
  if (before) {
    x = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(before),
            $lt: new Date(date),
          },
        },
      },

      { $unwind: "$orderItems" },

      {
        $group: {
          _id: "$orderItems.product",
          qty: { $sum: "$orderItems.qty" },
        },
      },

      { $match: { _id: ObjectId(productId) } },
    ]);
  } else {
    x = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(date),
            // $lt: "2021-06-25",
          },
        },
      },

      { $unwind: "$orderItems" },

      {
        $group: {
          _id: "$orderItems.product",
          qty: { $sum: "$orderItems.qty" },
        },
      },
      { $match: { _id: ObjectId(productId) } },
    ]);
  }

  if (x.length === 0) {
    x = [{ _id: productId, qty: 0 }];
  }

  return x;
};
export const productSoldAllTime = async (productId) => {
  const ObjectId = mongoose.Types.ObjectId;
  let x;

  x = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },

    { $unwind: "$orderItems" },

    {
      $group: {
        _id: "$orderItems.product",
        qty: { $sum: "$orderItems.qty" },
      },
    },
    { $match: { _id: ObjectId(productId) } },
  ]);

  if (x.length === 0) {
    x = [{ _id: productId, qty: 0 }];
  }

  return x;
};
export const moneySellerMadeAllTime = async (sellerId) => {
  const ObjectId = mongoose.Types.ObjectId;
  let x;

  x = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },

    {
      $group: {
        _id: "$seller",
        money: { $sum: "$totalPrice" },
      },
    },
    { $match: { _id: ObjectId(sellerId) } },
  ]);
  if (x.length === 0) {
    x = [{ _id: sellerId, money: 0 }];
  }
  return x;
};
export const moneySellerMade = async (date, sellerId, before) => {
  const ObjectId = mongoose.Types.ObjectId;
  let x;
  if (before) {
    x = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(before),
            $lt: new Date(date),
          },
          isPaid: true,
        },
      },

      {
        $group: {
          _id: "$seller",
          money: { $sum: "$totalPrice" },
        },
      },
      { $match: { _id: ObjectId(sellerId) } },
    ]);
  } else {
    x = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(date),
            // $lt: "2021-06-25",
          },
        },
      },

      {
        $group: {
          _id: "$seller",
          money: { $sum: "$totalPrice" },
        },
      },
      { $match: { _id: ObjectId(sellerId) } },
    ]);
  }
  if (x.length === 0) {
    x = [{ _id: sellerId, money: 0 }];
  }
  return x;
};

export const dailyOrdersFunc = async (date, userId) => {
  let x;
  const ObjectId = mongoose.Types.ObjectId;

  if (userId) {
    if (date === yesterday) {
      x = await Order.aggregate([
        {
          $match: {
            seller: ObjectId(userId),
            isPaid: true,
          },
        },
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
              $gte: date,
              $lt: todayDate,
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    } else {
      x = await Order.aggregate([
        {
          $match: {
            seller: ObjectId(userId),
            isPaid: true,
          },
        },
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
              $gte: date,
              // $lt: "2021-06-25",
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    }

    if (x.length === 0) {
      x = [{ _id: date, orders: 0, sales: 0 }];
    }
    return x;
  }
  if (date === yesterday) {
    x = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
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
            $gte: date,
            $lt: todayDate,
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  } else {
    x = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
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
            $gte: date,
            // $lt: "2021-06-25",
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  if (x.length === 0) {
    x = [{ _id: date, orders: 0, sales: 0 }];
  }
  return x;
};
// for spesific seller
export const dailyOrdersSellerFunc = async (date, sellerId) => {
  const ObjectId = mongoose.Types.ObjectId;

  let x;
  if (date === yesterday) {
    x = await Order.aggregate([
      {
        $match: {
          seller: ObjectId(sellerId),
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d-%H", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
          //   sellerId: "$seller",
        },
      },
      {
        $match: {
          _id: {
            $gte: date,
            $lt: todayDate,
          },
          //   sellerId: ObjectId(sellerId),
        },
      },
      { $sort: { _id: 1 } },
    ]);
  } else {
    x = await Order.aggregate([
      {
        $match: {
          seller: ObjectId(sellerId),
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d-%H", date: "$createdAt" },
          },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
          //   sellerId: "$seller",
        },
      },
      {
        $match: {
          _id: {
            $gte: date,
            // $lt: "2021-06-25",
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  return x;
};
// add Missing Hours orders per hour today and yesterday

export const addMissingHours = (dailyOrders, orderTime) => {
  let newHourObjFormat = {};
  dailyOrders[orderTime].map((dailyOrder) => {
    dailyOrder._id = `${dailyOrder._id.slice(11)}:00`;
    return (newHourObjFormat[dailyOrder._id] = dailyOrder);
  });

  dailyOrders[orderTime] = [];
  for (let i = 1; i <= 24; i++) {
    if (i < 10) {
      if (newHourObjFormat[`0${i}:00`]) {
        dailyOrders[orderTime].push(newHourObjFormat[`0${i}:00`]);
      } else {
        dailyOrders[orderTime].push({ _id: `0${i}:00`, orders: 0, sales: 0 });
      }
    }
    if (i >= 10) {
      if (newHourObjFormat[`${i}:00`]) {
        dailyOrders[orderTime].push(newHourObjFormat[`${i}:00`]);
      } else {
        dailyOrders[orderTime].push({ _id: `${i}:00`, orders: 0, sales: 0 });
      }
    }
  }
  console.log();
  return dailyOrders[orderTime];
};
