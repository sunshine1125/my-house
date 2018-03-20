const nodemailer = require('nodemailer')
let config = process.env.NODE_ENV === 'development' ? require('../config/dev') : require('../config/prod');

module.exports = function sendEmail(options) {
  let mailTransport = nodemailer.createTransport({
    host            : config.email.host,
    port            : 465,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth            : {
      user: config.email.user,
      pass: config.email.pass
    },
  });
  // let mailTransport = config().emailConfig();
  mailTransport.sendMail(options, (err, msg) => {
    if (err) {
      console.log(err);
      res.json({success: false, message: '发送失败！', error: err})
    } else {
      console.log(msg);
      res.json({success: true, message: '发送成功！'})
    }
  })
}
