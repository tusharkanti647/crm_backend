const mongoose= require('mongoose');


//create the user schema
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, //left and right side of the name if have any spce it trimes
    },
    number: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    conPassword: {
        type: String,
        required: true,
        minlength: 6,
    }
});

//user model create
const userModel=mongoose.model('users', userSchema);

//create customer schema
const customerSchema=mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, //left and right side of the name if have any spce it trimes
    },
    number: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    state:  {
        type: String,
        require: true,
    },
    city:  {
        type: String,
        require: true,
    },
    pinCode:{
        type: Number,
        require: true,
    },
    information: {
        type: String,
    },
    lastActivity: { type : Date, default: Date.now },
});

//create customer model
const customerModel = mongoose.model("customers", customerSchema);

module.exports ={userModel, customerModel}
