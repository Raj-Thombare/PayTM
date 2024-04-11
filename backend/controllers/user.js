import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/user.js";
import { JWT_SECRET } from "../config.js";

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

export const signUp = async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken",
      });
    }

    const hashedPw = await bcrypt.hash(req.body.password, 12);

    const user = await User.create({
      username: req.body.username,
      password: hashedPw,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const userId = user._id;

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Incorrect Inputs",
      });
    }

    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(411).json({
        message: "User doesn't exist!",
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!passwordMatch) {
      res.status(401).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id,
      },
      JWT_SECRET,
    );

    res.json({
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};
