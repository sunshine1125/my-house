exports.install = (Vue, options) => {

  const isEmail = (rule, value, callback) => {
    if (value !== null && value !== "") {
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  var password = '';
  const isPassword = (rule, value, callback) => {
    if (value !== null && value !== "") {
      if (value.length < 4) {
        callback(new Error('密码长度应大于4个字符'))
      } else {
        password = value;
        callback();
      }
    } else {
      callback();
    }
  };
  const isPassAgain = (rule, value, callback) => {
    if (value !== null && value !== "") {
      if (value !== password) {
        callback(new Error('两次输入密码应一致'))
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  Vue.prototype.validate_rules = (item) => {
    let rules = [];
    if (item.required) {
      rules.push({required: true, message: '该项为必填项！', trigger: 'blur'})
    }
    if (item.minLength) {
      rules.push({min: item.minLength, message: '长度至少为' + item.minLength + '个字符', trigger: 'blur, change'})
    }
    if (item.min && item.max) {
      rules.push({min: item.min, max: item.max, message: '长度在' + item.min + '至' + item.max + '个字符之间', trigger: 'blur, change'});
    }
    if (item.type) {
      let type = item.type;
      switch (type) {
        case 'email':
          rules.push({validator: isEmail, trigger: 'blur, change'});
          break;
        case 'password':
          rules.push({validator: isPassword, trigger: 'blur, change'});
          break;
        case 'passAgain':
          rules.push({validator: isPassAgain, trigger: 'blur, change'});
          break;
        default:
          rules.push({});
          break;
      }
    }
    return rules;
  }
}
