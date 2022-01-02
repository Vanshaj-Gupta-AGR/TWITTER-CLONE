const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', 
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './public/assets',
    session_cookie_key: 'blahsomething',
    db: 'twitter_development',
    smtp: {
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
    },
    google_clientID: "479595391274-rpubadnma6ovkkcejsamfs2pudcg3dti.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
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
    },
    google_clientID: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports =production
