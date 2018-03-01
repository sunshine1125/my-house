const nodemailer = require('nodemailer');

module.exports = function configInfo() {
    return {
        databaseConnect: databaseConnect,
        emailConfig    : emailConfig,
        getconfirToken : getconfirToken,
        urlConfig      : urlConfig
    }
};

function databaseConnect() {
    return {
        'secret'  : 'ilovescotchyscotch',
        'database': 'mongodb://localhost/tables'
    }
}

function emailConfig() {
    return nodemailer.createTransport({
        host            : 'smtp.qq.com',
        secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth            : {
            user: '371262808@qq.com',
            pass: 'xxx'
        },
    });
}

function getconfirToken() {
    let token = '';
    let tokenArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9'
    ];
    for (let i = 0; i < 40; i++) {
        let index = Math.floor(Math.random() * 62);
        token += tokenArray[index];
    }
    return token;
}

function urlConfig() {
    return {
        "login"         : "http://localhost:8080/#/login?passedCheck=true",
        "changePassword": "http://localhost:8080/#/forgotPassword"
    }
}