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
  ],
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
// const mongodb = require("mongodb");
// const { getDb } = require("../util/database");
// const ObjectId = mongodb.ObjectId;
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cart = [...this.cart];
//     const cartProductIndex = cart.findIndex((cpi) => {
//       return cpi.productId.toString() === product._id.toString();
//     });
//     if (cartProductIndex >= 0) {
//       cart[cartProductIndex].quantity += 1;
//     } else {
//       cart.push({ productId: new ObjectId(product._id), quantity: 1 });
//     }
//     const updateCart = cart;
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updateCart } }
//       );
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => user)
//       .catch((err) => console.log(err));
//   }

//   getCart() {
//     const db = getDb();
//     const prodIds = this.cart.map((i) => i.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: prodIds } })
//       .toArray()
//       .then((product) => {
//         return product.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }

//   deleteCartItem(prodId) {
//     const newCart = this.cart.filter(
//       (i) => i.productId.toString() !== prodId.toString()
//     );
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: newCart } });
//   }

//   orderNow() {
//     const db = getDb();
//     return this.getCart().then(products=>{
//       const orders={
//         items:products,
//         userId:new ObjectId(this._id)
//       }
//       return db
//         .collection("orders")
//         .insertOne(orders)
//         .then((res) => {
//           this.cart = [];
//           return db
//             .collection("users")
//             .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: [] } });
//         })
//         .catch((err) => console.log(err));
//     })
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ userId: new ObjectId(this._id) })
//       .toArray()
//   }
// }

module.exports = mongoose.model("User", userSchema);
