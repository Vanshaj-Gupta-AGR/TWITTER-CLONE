const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path')
const xoauth2 = require('xoauth2');




let transporter = nodemailer.createTransport({
   service: "gmail",
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   auth: {
        type:"OAuth2",
        user: "vanshaj444@gmail.com",
        clientId: "193060280842-79movmqvjeebr7ctjmk4jampmghq093e.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04wd2S4yWUZGRCgYIARAAGAQSNwF-L9IrB3jV46_iXY56CABI9ZddrLOHb5VqNR7x8s7K1xr70FJ7FkKA2Cy7s_0SV-YARNxD1Bs",
        accessToken: "ya29.a0ARrdaM85u8_-SPdNKyqLgM0J_YwIu-p5GfpyO_hZ4CGkEOZ2ums82Q0Mde5yXFGMjyY3v1TD-v3GgGiiW1CooVf0f1HtEwEq3M3lBmAZtChNf0hXz8vuQHHp8SXQ04bK3bxXSL_MMgIEGMhBe5c6k5t8lHmv"
   
}
   
})
    



module.exports = {
    transporter: transporter,
}