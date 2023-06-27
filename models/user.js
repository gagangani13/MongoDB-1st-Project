const mongodb = require("mongodb");
const { getDb } = require("../util/database");
const Product = require("./product");
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
      cart[cartProductIndex].quantity+=1
    }else{
      cart.push({productId:new ObjectId(product._id),quantity:1})
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

  getCart() {
    const db=getDb()
    const prodIds=this.cart.map(i=>i.productId)
    return db.collection('products').find({_id:{$in:prodIds}}).toArray().then(product=>{
      return product.map(p=>{
        return{...p,quantity:this.cart.find(i=>{
          return i.productId.toString()===p._id.toString()
        }).quantity}
      })
    }).catch(err=>console.log(err))
  }

  deleteCartItem(prodId){
    const newCart=this.cart.filter(i=>i.productId.toString()!==prodId.toString())
    const db=getDb();
    return db.collection('users').updateOne({_id:new ObjectId(this._id)},{$set:{cart:newCart}})
  }

}

module.exports = User;
