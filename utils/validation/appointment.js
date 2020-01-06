const { check } = require('express-validator');

const validation = {
  //уточнить валидации
  create: [
    check('dentNumber').isInt({ min: 1, max: 48}),
    check('price').isInt({ min: 0}),
    check('diagnosis').isLength({ min: 3, max: 50}),
  ]
}

module.exports = validation;