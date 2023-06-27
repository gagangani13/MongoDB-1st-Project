const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  products: [
    {
      productData: { type: Object, required: true },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

orderSchema.methods.createOrder = function () {};

module.exports = mongoose.model("Order", orderSchema);
