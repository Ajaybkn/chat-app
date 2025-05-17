import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password && password.length < 6) {
      return res.status(400).send({
        message: "Password must be atleast 6 characters",
      });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).send({
        message: "new user successfully created",
        newUser,
      });
    } else {
      res.status(400).send({
        message: "invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup", error);
    res.status(500).send({
      message: "server Error",
    });
  }
};
export const login = (req, res) => {
  res.send("login route");
};
export const logout = (req, res) => {
  res.send("logout route");
};
