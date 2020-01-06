const { validationResult } = require('express-validator');
const { Patient } = require('../models');
 
 function PatientController() {}

 const create = (req, res) => {
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array() 
      });
  }

  const data = {
    fullName: req.body.fullName,
    phone: req.body.phone,
  };

  Patient.create(data, (err, doc) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

  res.status(201).json({
      success: true,
      data: doc
    });
  });
 }

const all = function(req, res) {
  Patient.find({}, (err, doc) => {
    if(err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
    res.json({
      success: true,
      data: doc
    });
  });
 };

 PatientController.prototype = {
  all,
  create,
 };

 module.exports = PatientController;