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

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
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

export const updateUser = async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
};

export const searchUser = async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          ["$regex"]: filter,
          ["$options"]: "i",
        },
      },
      {
        lastName: {
          ["$regex"]: filter,
          ["$options"]: "i",
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
};
