const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { passwordValidation, mailValidation, numberValidation, pinCodeValidation } = require("../myModule/operation");
router.use(bodyParser.json());

//get the user and customer Model
const { userModel, customerModel } = require("../model/schema");

//take sereatKey and connect with passport 
const secretKey = process.env.KEY;
require("./passport");

//users apis
//----------------------------------------------------------------
//signUp api
//--------------------------------------------------------------------------------------
router.post("/signup", async (req, res) => {
    try {
        const { name, number, email, password, conPassword } = req.body;

        //check all filled is filledup or not
        if (!name || !number || !email || !password || !conPassword) {
            res.status(400).json({ message: "please provide data" });
            return;
        }
        if (!passwordValidation(password)) {
            res.status(400).json({ message: "password is invalid" });
            return;
        }
        if (!mailValidation(email)) {
            res.status(400).json({ message: "email is invalid" });
            return;
        }
        if (!numberValidation(number)) {
            res.status(400).json({ message: "phone number is invalid" });
            return;
        }

        //save data in mongodb
        const user = new userModel({
            name, number, email,
            password: bcrypt.hashSync(req.body.password, 10),
            conPassword: bcrypt.hashSync(req.body.password, 10)
        });
        const response = await user.save();

        //generate token call the function
        const token = await generateAuthToken(response._id);
        res.status(201).json({ user, token: "Bearer " + token });
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
});

//sign in api
//------------------------------------------------------------------------------------------
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        //check all filled is filledup or not
        if (!email || !password) {
            res.status(400).json("invalid Credentials");
            return;
        }

        //find the user from mongodb
        let user = await userModel.findOne({ email: email });
        if (!user) {
            res.status(400).json({ messge: "user not present" });
            return;
        }

        //compare the hash password and match it
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(400).json({ message: "password not match" });
            return;
        }

        //generate token call the function
        const token = await generateAuthToken(user._id);
        res.status(201).json({ user, token: "Bearer " + token });
    } catch (error) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
});


//customers apis
//----------------------------------------------------------------

//add customer api
//----------------------------------------------------------------
router.post("/customer-add", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            const { name, number, email, country, state, city, pinCode, information } = req.body;

            //check all filled is filledup or not
            if (!name || !number || !email || !country || !state || !city || !pinCode) {
                res.status(400).json({ message: "please provide data" });
                return;
            }
            if (!mailValidation(email)) {
                res.status(400).json({ message: "email is invalid" });
                return;
            }
            if (!numberValidation(number)) {
                res.status(400).json({ message: "phone number is invalid" });
                return;
            }
            if (!pinCodeValidation(pinCode)) {
                res.status(400).json({ message: "PIN Code is invalid" });
                return;
            }

            //save data in mongodb
            const customer = new customerModel({
                name, number, email, country, state, city, pinCode, information
            });

            const response = await customer.save();
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});

//edit customer api
//----------------------------------------------------------------
router.put("/customer-edit/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            let _id = req.params.id;
            const { name, number, email, country, state, city, pinCode, information } = req.body;
            
            //check all filled is filledup or not
            if (!name || !number || !email || !country || !state || !city || !pinCode) {
                res.status(400).json({ message: "please provide data" });
                return;
            }
            if (!mailValidation(email)) {
                res.status(400).json({ message: "email is invalid" });
                return;
            }
            if (!numberValidation(number)) {
                res.status(400).json({ message: "phone number is invalid" });
                return;
            }
            if (!pinCodeValidation(pinCode)) {
                res.status(400).json({ message: "PIN Code is invalid" });
                return;
            }

            const data = await customerModel.updateOne({ _id: _id }, {
                $set: {
                    name, number, email, country, state, city, pinCode, information,
                    lastActivity: Date.now(),
                }
            });
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});

//delete customer api
//----------------------------------------------------------------
router.delete("/customer-delete/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            let _id = req.params.id;

            const data = await customerModel.deleteOne({ _id });
            console.log(data);
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "please login first" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});

//get customers api
//----------------------------------------------------------------
router.get("/customer-get", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            let { searchName, page, sortQue } = req.query;
            searchName = searchName || "";
            page = page - 1 || 0;
            sortQue = sortQue ? sortQue.split(" ") : ["lastActivity", "-1"];
            let limit = 3;

            let sortBy = {};
            sortBy[sortQue[0]] = parseInt(sortQue[1]);
            const data = await customerModel.find({ name: { $regex: searchName, $options: "i" } })
                .sort(sortBy)
                .skip(page * limit)
                .limit(limit);
            //const data = await customerModel.find({ name: { $regex: searchName, $options: "i" } }).sort ( { date: -1} );

            const data2 = await customerModel.find({ name: { $regex: searchName, $options: "i" } })
                .sort(sortBy)
                .skip((page + 1) * limit)
                .limit(limit);
            let isNextPagePresent = false;
            if (data2.length > 0) {
                isNextPagePresent = true;
            }

            res.status(200).json({ data: data, isNextPagePresent: isNextPagePresent });
        } else {
            res.status(404).json({ message: "please login first" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});

//get 1 customers deltas api
//----------------------------------------------------------------
router.get("/customer-deltas/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            const customer = await customerModel.findById(req.params.id);
            if (customer) {
                res.status(200).json(customer);
            } else {
                res.status(404).json({ message: "customer not found" });
            }
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});

//check user is logged in
//-----------------------------------------------
router.get("/userIs-signIn", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json(req.user);
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
});


//generate token 
//-----------------------------------------------
async function generateAuthToken(id) {
    try {
        //first creat a paylod
        const paylod = {
            _id: id,
        }

        //create token
        token = jwt.sign(paylod, secretKey, { expiresIn: "1d" });
        return token;
    } catch (err) {
        console.log(err);
    }
}
module.exports = router;