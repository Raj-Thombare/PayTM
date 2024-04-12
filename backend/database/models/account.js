import mongoose from "mongoose";
const { Schema } = mongoose;

const accountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Account = mongoose.model("Account", accountSchema);
export default Account;
