import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

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
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        if (user.seller) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(user),
            seller: {
              name: user.seller.name,
              logo: user.seller.logo,
              description: user.seller.description,
            },
          });
        } else {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            token: generateToken(user),
          });
        }

        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, sellerName, sellerLogo, sellerDescription } = req.body;
    if (name && email && sellerName && sellerLogo && sellerDescription) {
      const user = new User({
        name,
        email,
        seller: {
          name: sellerName,
          logo: sellerLogo,
          description: sellerDescription,
        },
        isSeller: true,

        password: bcrypt.hashSync(req.body.password, 8),
      });
      console.log(user);
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
      });
    } else if (name && email) {
      const user = new User({
        name,
        email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
      });
    } else {
      res.status(401).send({ message: "fill all the file" });
    }
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    console.log(req.params.id);

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
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();

      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: "User Deleted", user: deleteUser });
    } else {
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
      console.log(user.isSeller);
      console.log(user.isAdmin);
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
      console.log(updatedUser);
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
export default userRouter;
