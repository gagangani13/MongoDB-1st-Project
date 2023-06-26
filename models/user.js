const mongodb = require("mongodb");
const { getDb } = require("../util/database");
const ObjectId=mongodb.ObjectId
class User {
  constructor(name, email,cart,id) {
    this.name = name;
    this.email = email;
    this.cart=cart;
    this._id=id
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product){
    const cart=[...this.cart];
    const cartProductIndex=cart.findIndex(cpi=>{
        return cpi.productId.toString()===product._id.toString()
      })   
    if (cartProductIndex>=0) {
      cart[cartProductIndex].qty+=1
    }else{
      cart.push({productId:new ObjectId(product._id),qty:1})
    }
    const updateCart=cart
    const db = getDb();
    return db.collection('users').updateOne({_id:new ObjectId(this._id)},{$set:{cart:updateCart}})
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }

}

module.exports = User;
