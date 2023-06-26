const mongodb=require('mongodb');
const { getDb } = require('../util/database');

class User{
  constructor(name,email,id){
    this.name=name,
    this.email=email,
    this._id=new mongodb.ObjectId(id)

  }
  save(){
    const db=getDb()
    return db.connection("users").insertOne(this)
  }
  static findById(userId){
    const db=getDb()
    return db.connection("users").find({_id:this._id}).next()
  

  }
}


module.exports = User;
