const mongoose = require("mongoose");
const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coins: [
    {
      symbol: String,
      min: Number,
      max: Number,
    },
  ],
  notify: {
    type: Boolean,
  },
  userID: {
    type: Number,
    required: true,
  },
});

mongoose.model("users", UsersSchema);
