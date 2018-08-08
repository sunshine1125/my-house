const models  = require('../models');
const express = require('express');
const router  = express.Router();

router.get('/', function(req, res) {
  models.User.findAll({
    include: [ models.Post ]
  }).then(function(users) {
    res.status('200').json({
      users: users
    });
  });
});

module.exports = router;
