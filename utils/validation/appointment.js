const { check } = require('express-validator');

function getValidation(param) {
  const checksArray = [
    check('dentNumber').isInt({ min: 1, max: 48}),
    check('price').isInt({ min: 0}),
    check('diagnosis').isLength({ min: 1}),
    check('date').isLength({ min: 1}),
    check('time').isLength({ min: 1}),
  ];

  if (param === 'create') {
    checksArray.push(check('patient').isLength({ min: 1}));
  }

  return checksArray;
}

module.exports = getValidation;