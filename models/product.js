const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class Product {
//     constructor(title, price, description, imageUrl, id, userId){
//         this._id = id ? mongodb.ObjectId(id) : null;
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this.userId = userId;
//     }

//     save(){
//         const db = getDb();
//         if (this._id){
//             return db.collection('products').updateOne({_id: this._id}, {$set: this});
//         } else {
//             return db.collection('products').insertOne(this);
//         }
//     }

//     static findById(prodId) {
//         console.log("product id: ", new mongodb.ObjectId(prodId));
//         const db = getDb();
//         return db.collection('products').find({_id: new mongodb.ObjectId(prodId)}).next()
//             .then(product => {
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//             .then(products => {
//                 console.log(products);
//                 return products;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static deleteById(prodId){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//             .then(result => {
//                 console.log("Deleted item.");
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
// }

// module.exports = Product;