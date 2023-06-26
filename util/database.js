const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect=(callback)=>{
  MongoClient.connect(
    "mongodb+srv://gagangani17:Fullstack@cluster0.hukmuil.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("success");
      _db=client.db();
      callback();
    })
    .catch((err) => console.log(err));
}

const getDb=()=>{
  if (_db) {
    return _db
  }
  throw 'No Database found'
}

module.exports={mongoConnect,getDb}