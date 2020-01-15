let mongoose = require('mongoose');

let mongodb_uri = process.env.DATABASE_URL;


let db = mongoose.createConnection(mongodb_uri,{useUnifiedTopology:false, useNewUrlParser: true});
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', function() {
    console.log("Database connected") // we're connected!
});

module.exports = {
    db: db
};