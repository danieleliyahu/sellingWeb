import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";

import {
  createAccessToken,
  createActivationToken,
  createRefreshToken,
  generateToken,
  isAdmin,
  isAuth,
  passwordValidate,
  validateEmail,
} from "../utils.js";
import { sendMail } from "./sendMail.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({
        "seller.rating": -1,
      })
      .limit(3);
    res.send(topSellers);
  })
);

userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(403).send({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch)
        return res.status(403).json({ msg: "Password is incorrect." });
      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refresh_token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }

    // if (user.isSeller) {
    //   res.send({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    //     isSeller: user.isSeller,
    //     token: generateToken(user),
    //     seller: {
    //       name: user.seller.name,
    //       logo: user.seller.logo,
    //       description: user.seller.description,
    //     },
    //   });
    // } else {
    //   res.send({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     isAdmin: user.isAdmin,
    //     isSeller: user.isSeller,
    //     token: generateToken(user),
    //   });
    // }
  })
);

userRouter.post(
  "/refresh_token",
  expressAsyncHandler((req, res) => {
    console.log(req.cookies.refreshToken);

    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(403).json({ message: "Please login now!" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            console.log(err);

            return res.status(400).json({ message: "Please login now!" });
          }

          const accessToken = createAccessToken({ id: user.id });
          res.cookie("accessToken", accessToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          console.log(user, "sssssssssssssssssssssssssss");
          const userInfo = await User.findOne({ _id: user.id });

          res.json(userInfo);
        }
      );
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);

userRouter.post(
  "/forgot",
  expressAsyncHandler(async (req, res) => {
    const { CLIENT_URL } = process.env;
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).send({ message: "This email does not exist" });
      const access_token = createAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/user/reset/${access_token}`;
      sendMail(email, url, "Reset your password");
      res.json({ message: "Re-send the password,please check your email." });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  })
);

userRouter.post(
  "/reset",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { password } = req.body;
      if (!passwordValidate(password)) {
        return res.status(401).send({
          message:
            "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
        });
      }

      const passwordHash = await bcrypt.hash(password, 8);
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );
      res.send({ message: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  })
);

userRouter.get(
  "/info",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      // if (!user) {
      //   res.status(403).send();
      // }
      res.send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      email,
      sellerName,
      confirmPassword,
      password,
      sellerLogo,
      sellerDescription,
    } = req.body;
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(401).send({ message: "user already exists" });
    }
    // let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    // let passwordValidate = re.test(String(password));
    // if (password.length < 8 || !passwordValidate) {
    //   return res.status(401).send({
    //     message:
    //       "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    //   });
    // }
    if (!passwordValidate(password)) {
      return res.status(401).send({
        message:
          "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      });
    }
    if (password !== confirmPassword) {
      return res.status(401).send({
        message: "Password and confirm Password dont match",
      });
    }
    if (!validateEmail(email)) {
      return res.status(401).send({ message: "invalid email" });
    }

    if (
      name &&
      email &&
      sellerName &&
      sellerLogo &&
      sellerDescription &&
      password
    ) {
      const userInfo = {
        name,
        email,
        seller: {
          name: sellerName,
          logo: sellerLogo,
          description: sellerDescription,
        },
        isSeller: true,

        password: bcrypt.hashSync(req.body.password, 8),
      };
      // const user = new User({
      //   userInfo
      // });
      const activation_token = createActivationToken(userInfo);
      const url = `${process.env.CLIENT_URL}user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");

      res.send({
        message: "Register Success! Please activate your email to start.",
        success: true,
      });

      // const createdUser = await user.save();
      // res.send({
      //   _id: createdUser._id,
      //   name: createdUser.name,
      //   email: createdUser.email,
      //   isAdmin: createdUser.isAdmin,
      //   isSeller: user.isSeller,
      //   token: generateToken(createdUser),
      // });
    } else if (name && email && password) {
      const userInfo = {
        name,
        email,
        password: bcrypt.hashSync(req.body.password, 8),
      };
      const activation_token = createActivationToken(userInfo);
      const url = `${process.env.CLIENT_URL}user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");
      // const createdUser = await user.save();
      // res.send({
      //   _id: createdUser._id,
      //   name: createdUser.name,
      //   email: createdUser.email,
      //   isAdmin: createdUser.isAdmin,
      //   isSeller: user.isSeller,
      //   token: generateToken(createdUser),
      // });
      res.send({
        message: "Register Success! Please activate your email to start.",
      });
    } else {
      res.status(401).send({ message: "Please fill in all fields" });
    }
  })
);
userRouter.get(
  "/allusers",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");

    res.send(users);
  })
);
userRouter.post(
  "/activate",
  expressAsyncHandler(async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );

      const check = await User.findOne({ email: user.email });
      if (check) {
        return res.status(400).json({ message: "This email already exsists." });
      }

      if (
        user.name &&
        user.email &&
        user.password &&
        user.isSeller &&
        user.seller.name &&
        user.seller.logo &&
        user.seller.description
      ) {
        const { name, email, password, seller, isSeller } = user;
        const newUser = new User({
          name,
          email,
          password,
          seller: {
            name: seller.name,
            logo: seller.logo,
            description: seller.description,
          },
          isSeller,
        });
        await newUser.save();
        res.json({ message: "Account has been activated!" });
      } else if (user.name && user.email && user.password) {
        const { name, email, password, isAdmin, isSeller, token } = user;
        const newUser = new User({
          name,
          email,
          password,
          isAdmin,
          isSeller,
          token,
        });
        await newUser.save();
        res.json({ message: "Account has been activated!" });
      } else {
        res.status(401).send({ message: "invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  })
);
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).send({ message: "You are not signed in" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (user.isSeller) {
      user.seller.name = req.body.sellerName || user.seller.name;
      user.seller.description =
        req.body.sellerDescription || user.seller.description;
      user.seller.logo = req.body.sellerLogo || user.seller.logo;
    }
    if (req.body.password) {
      if (!passwordValidate(req.body.password)) {
        return res.status(500).send({
          message:
            "Password most contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
        });
      }

      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    res.send({ message: "Update Success" });
    // res.send({
    //   _id: updatedUser._id,
    //   name: updatedUser.name,
    //   email: updatedUser.email,
    //   isAdmin: updatedUser.isAdmin,
    //   isSeller: user.isSeller,
    //   token: generateToken(updatedUser),
    // });
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.send({ message: "User Deleted" });
    } catch (err) {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // user.isSeller =
      //   req.body.isSeller === user.isSeller ? user.isSeller : req.body.isSeller;
      // user.isAdmin =
      //   req.body.isAdmin === user.isAdmin ? user.isAdmin : req.body.isAdmin;

      user.isAdmin = Boolean(req.body.isAdmin);
      user.isSeller = Boolean(req.body.isSeller);

      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (user) {
      if (user.seller.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      user.seller.reviews.push(review);
      user.seller.numReviews = user.seller.reviews.length;
      user.seller.rating =
        user.seller.reviews.reduce((a, c) => Number(c.rating) + a, 0) /
        user.seller.numReviews;

      const updatedUser = await user.save();
      res.status(201).send({
        message: "Review Created",
        review:
          updatedUser.seller.reviews[updatedUser.seller.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.get("/", expressAsyncHandler, async (req, res) => {
  try {
    res.clearCookie("refreshtoken");
    return res.send({ message: "Logged out." });
  } catch (err) {
    return res.status(500).send({ message: error.message });
  }
});
export default userRouter;
