const { check } = require('express-validator');

const validation = {
  create: [
    check('fullName').isLength({ min: 6}),
<<<<<<< HEAD
    check('phone').isLength({ min: 9})
=======
    check('phone').isLength({ min: 10})
>>>>>>> origin/master
  ]
}


module.exports = validation;