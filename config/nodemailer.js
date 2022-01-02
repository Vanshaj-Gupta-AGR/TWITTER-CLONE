const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')
const xoauth2 = require('xoauth2');
const env= require('./environment');




let transporter = nodemailer.createTransport(env.smtp)
    



module.exports = {
    transporter: transporter,
}