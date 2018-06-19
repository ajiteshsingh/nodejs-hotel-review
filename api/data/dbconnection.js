var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017'

var _connection = null;

var open = function(){
    MongoClient.connect(dburl, function(err, client){
        if(err){
            console.log("Database connection has failed");
            return;
        }
        _connection = client.db('meanhotels');
        console.log("Database connection is open", client);
    });
};

var get = function(){
    return _connection;
};

module.exports = {
    open: open,
    get:get
};