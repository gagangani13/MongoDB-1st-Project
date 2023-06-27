const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ]
});

userSchema.methods.addToCart = function (product) {
  const cart = [...this.cart];
  const cartProductIndex = cart.findIndex((cpi) => {
    return cpi.productId.toString() === product._id.toString();
  });
  if (cartProductIndex >= 0) {
    cart[cartProductIndex].quantity += 1;
  } else {
    cart.push({ productId: product._id, quantity: 1 });
  }
  this.cart = cart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (prodId) {
  const newCart = this.cart.filter((i) => i.productId.toString() !== prodId);
  return this.updateOne({ cart: newCart });
};

userSchema.methods.clearCart=function () {
  this.cart=[]
  this.save()
}

//----populate is best solution----
// userSchema.methods.getCart = function () {
//   const prodIds = this.cart.map((i) => i.productId);
//   return Product.find({ _id: { $in: prodIds } })
//     .then((product) => {
//       return product.map((p) => {
//         return {
//           ...p,
//           quantity: this.cart.find((i) => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity,
//         };
//       });
//     })
//     .catch((err) => console.log(err));
// };


module.exports = mongoose.model("User", userSchema);
