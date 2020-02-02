const { validationResult } = require('express-validator');
const { Patient } = require('../models');
const getCurrentDataForFilteringData = require('../utils/getCurrentDateForFIlteringData');

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

const all = (req, res) => {
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
}

const one = async (req, res) => {
  const {id} = req.params;
  const {type} = req.query;
console.log(type);
  try {
    const filterOfQuery = type === 'during' ? { $gte: getCurrentDataForFilteringData } : { $lte: getCurrentDataForFilteringData };
    const patient = await Patient.findById(id).populate({path: 'appointments',  match: { date: filterOfQuery }, options:  {sort: '-date'} }).exec();
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient IS NOT FOUND'
      });
    }

    res.status(201).json({
      success: true,
      data: {...patient._doc, appointments: patient.appointments}
    });
  } catch(e) {
    res.status(500).json({
      success: false,
      message: 'INCORRECT ID OF PATIENT'
    });
  }
}

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const isExistPatient = await Patient.findByIdAndDelete(id);
    
    if (!isExistPatient) {
      return res.status(404).json({
        success: false,
        data: 'Patient Not Found',
      });
    } 

    res.json({
      success: true,
    });

  } catch (e) {
    res.json({
      success: false,
      message: 'INCORRECT ID OF Patient'
    })
  }
}

const update = async (req, res) => { 
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array() 
    });
  }

  const patientId = req.params.id;
  const data = {
    fullName: req.body.fullName,
    phone: req.body.phone,
  };

  Patient.updateOne({_id: patientId}, data, (err, doc) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
    
    if (!doc.n) {
      return res.status(404).json({
        success: false,
        data: 'Patient Not Found',
      });
    }

    res.status(201).json({
        success: true,
        data: doc
      });
    });
}

 PatientController.prototype = {
  all,
  create,
  remove,
  update,
  one
 };

 module.exports = PatientController;