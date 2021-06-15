import jwt from "jsonwebtoken";
import mg from "mailgun-js";
import dotenv from "dotenv";
import User from "./models/userModel.js";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET || "danieleliyho",
    {
      expiresIn: "30d",
    }
  );
};
export const passwordValidate = (password) => {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  let Validate = re.test(String(password));
  console.log(Validate, "ffffffffffffffffffffffffffffffffffffffff");
  if (password.length < 8 || !Validate) {
    return false;
  } else {
    return true;
  }
};
export const createActivationToken = (payload) => {
  console.log(payload, process.env.ACTIVATION_TOKEN_SECRET);
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};
export const createAccessToken = (user) => {
  console.log(user, "user");
  console.log(process.env.ACCESS_TOKEN_SECRET);

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  console.log(authorization);

  if (authorization) {
    const token = authorization.slice(7, authorization.length);

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "danieleliyho",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  }
};
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user.isAdmin) {
      return res
        .status(500)
        .send({ message: "Admin resources access denied." });
    }
    ca;
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
// export const isAdmin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401).send({ message: "Invalid Admin Token" });
//   }
// };

// export const isSeller = (req, res, next) => {
//   if (req.user && req.user.isSeller) {
//     next();
//   } else {
//     res.status(401).send({ message: "Invalid Seller Token" });
//   }
// };
export const isSeller = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user.isSeller) {
      return res
        .status(500)
        .send({ message: "Admin resources access denied." });
    }
    ca;
    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  if ((req.user && req.user.isSeller) || req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/Seller Token" });
  }
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>Thanks for shopping with us</h1>
  <p>
  Hi ${order.user.name},</p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> $${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join("\n")}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right"> $${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2"><strong>Total Price:</strong></td>
  <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Thanks for shopping with us.
  </p>
  `;
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
