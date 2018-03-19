module.exports = {
  'MongoDB': {
    'secret'  : 'xxx',
    'database': 'mongodb://localhost:test'
  },
  'email': {
    'host': 'xxx',
    'user': 'xxx',
    'pass': 'xxxx'
  },
  'url': {
    "login"         : "xxxx",
    "changePassword": "xxxx"
  },
  'http': {
    'apiPort': 'xxx'
  }
}
// module.exports = function configInfo() {
//     return {
//         databaseConnect: databaseConnect,
//         emailConfig    : emailConfig,
//         getconfirToken : getconfirToken,
//         urlConfig      : urlConfig
//     }
// };
//
// function databaseConnect() {
//     return {
//         'secret'  : 'ilovescotchyscotch',
//         'database': 'mongodb://vue-express_rw:F368yh3uy@localhost:25688/vue-express'
//     }
// }
//
// function emailConfig() {
//     return nodemailer.createTransport({
//         host            : 'smtp.qq.com',
//         secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
//         auth            : {
//             user: '371262808@qq.com',
//             pass: 'xxx'
//         },
//     });
// }
//
// function urlConfig() {
//     return {
//         "login"         : "http://localhost:8080/#/login?passedCheck=true",
//         "changePassword": "http://localhost:8080/#/forgotPassword"
//     }
// }
