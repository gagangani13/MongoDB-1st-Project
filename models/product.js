const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    db.collection("products")
      .insertOne(this)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;