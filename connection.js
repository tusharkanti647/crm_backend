const mongoose = require('mongoose');

const db = process.env.DATABASE;

mongoose.connect(db)
.then(()=>{
    console.log("server is connect with mongodb");
})
.catch((err)=>{
    console.log(err);
})