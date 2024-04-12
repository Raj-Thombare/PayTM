import mongoose from "mongoose";
import Account from "../database/models/account.js";

export const getBalance = async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.status(200).json({
    balance: account.balance,
  });
};

export const transferAmount = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  const { to, amount } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    },
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    },
  ).session(session);

  await session.commitTransaction();

  res.status(200).json({
    message: "Transfer successful",
  });
};

// transferAmount({
//   userId: "6618ee392319386a232bf849",
//   body: {
//     to: "6618ee202319386a232bf844",
//     amount: 1000,
//   },
// });

// transferAmount({
//   userId: "6618ee392319386a232bf849",
//   body: {
//     to: "6618ee202319386a232bf844",
//     amount: 1000,
//   },
// });
