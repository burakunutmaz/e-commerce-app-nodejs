const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {

    MongoClient.connect('mongodb+srv://burak:burakadmin@cluster0.zp3ye6m.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
        console.log("Connected!");
        _db = client.db();
        cb();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if (_db){
        return _db;
    }

    throw "No Database Found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
