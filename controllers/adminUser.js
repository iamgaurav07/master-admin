// "use strict";
const adminUser = require("../models/website/adminUser");
const mongoose = require("mongoose");
const config = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
    addUser: async (req, res) => {
        try {
            let checkEmail = await adminUser.findOne({ email: req.body.email });
            if (checkEmail) {
                res.status(200).send({
                    success: false,
                    message: "duplicate",
                    code: 422
                })
            } else {
                let newUser = new adminUser(req.body);
                const password = newUser.password;
                const saltRounds = 10;
                newUser.password = await bcrypt.hash(password, 10);
                const result = await newUser.save();

                const token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
                    expiresIn: 604800 //1 week
                });
                result
                    ? res.status(200).send({
                        success: true,
                        message: "user registered",
                        res: {
                            token: "JWT " + token,
                            user: {
                                id: newUser._id,
                                email: newUser.email
                            }
                        }
                    })
                    : res
                        .status(422)
                        .send({ success: false, message: "fail to register", res: result });

            }

        } catch (err) {
            console.log(err);
            res.send(err);
        }
    },
    getUsers: async (req, res) => {
        try {
            const result = await adminUser.find();
            console.log("result is........", result);
            result
                ? res.status(200).send({
                    success: true,
                    message: "all Users",
                    res: result
                })
                : res.status(422).send({
                    success: false,
                    message: "not getting any user"
                });
        } catch (err) {
            console.log("catch err is........", err);
            res.send(err);
        }
    },

    editUser: async (req, res) => {
        try {
            var passcheck = req.body.password;
            const saltRounds = 10;
            passcheck = await bcrypt.hash(passcheck, 10);

            const result = await adminUser.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        password: passcheck,
                    }
                }
            );
            result
                ? res.status(200).send({
                    success: true,
                    message: "data is successfully edit",
                    res: result
                })
                : res.status(422).send({
                    success: false,
                    message: "data not edit"
                });
        } catch (err) {
            console.log("catch err in get user profile update........", err);
            res.send(err);
        }
    },

    authenticateUser: async (req, res) => {
        let password = req.body.password;
        let email = req.body.email;

        let user = await adminUser.findOne({ email: email })
        if (user) {

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jwt.sign(user.toJSON(), process.env.SECRET, {
                        expiresIn: 604800 //1 week
                    });
                    res.json({
                        success: true,
                        token: "JWT " + token,
                        user: {
                            id: user._id,
                            email: user.email
                        }
                    });
                } else {
                    return res.json({ success: false, msg: "Wrong Password" });
                }
            });

        } else {
            return res.json({ success: false, msg: "Wrong Password" });
        }
    }
};
