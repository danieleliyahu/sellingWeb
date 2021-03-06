import multer from "multer";
import express from "express";
import { isAuth } from "../utils.js";

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });
uploadRouter.post("/logo", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});
uploadRouter.post("/", isAuth, upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send(`/${req.file.path}`);
});
// uploadRouter.post("/", isAuth, upload.array("images"), (req, res) => {
//   console.log(req.file);
//   res.send(`/${req.file.path}`);
// });
export default uploadRouter;
