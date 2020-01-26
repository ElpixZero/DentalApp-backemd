const {Appointment, Patient} = require('../models');
const { validationResult } = require('express-validator');
const { delayedSMS, getDateNames } = require('../utils');
const dayjs = require('dayjs');
const dotenv = require('dotenv');
const {groupBy, reduce} = require('lodash');

const setActiveKey = require('../utils/setActiveKey');

dotenv.config();

function AppointmentController() {}

const create = async (req, res) => {
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array() 
    });
  }

  let isExistPatient;
 
  const data = {
    patient: req.body.patient,
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  try {
    isExistPatient = await Patient.findById(data.patient);
    if (!isExistPatient) {
      return res.status(404).json({
        success: false,
        data: 'Patient Not Found',
      });
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      data: 'INCORRECT ID OF PATIENT',
    });
  }
  
  Appointment.create(data, (err, doc) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }

    const preraredTypeOfDate = `${data.date.split('.').reverse().join('.')}T${data.time}`;
    const unixDateForSMS = dayjs(preraredTypeOfDate).subtract(1, 'hour').unix();

    delayedSMS({
      number: isExistPatient.phone, 
      time: unixDateForSMS,
      text: `Сегодня в ${data.time} у Вас прием в стоматологию Гранит.`
    });

    res.status(201).json({
      success: true,
      data: doc
    });
  });
}

const all = (req, res) => {
  Appointment.find({}).populate('patient').sort('date').exec( (err, doc) => {
    if(err) {
      return res.status(500).json({
        success: false,
        message: err
      })
    }
    
    const groupedData = groupBy(doc, 'date');
    
    const correctFormGroupedData = reduce(groupedData, function(result, value, key) {
      result.push( result.length === 0 ? {
        title: getDateNames(key),
        data: setActiveKey(value)
      } : {
        title: getDateNames(key),
        data: value
      })
      return result;
    }, []);

    res.json({
      success: true,
      data: correctFormGroupedData
    });
  });
}

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const resultOfDeleting = await Appointment.findByIdAndDelete(id);
    
    if (!resultOfDeleting) {
      return res.status(404).json({
        success: false,
        data: 'Appointment Not Found',
      });
    } 

    res.json({
      success: true,
    });

  } catch (e) {
    res.json({
      success: false,
      message: 'INCORRECT ID OF APPOINTMENT'
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

  const appointmentId = req.params.id;

  const data = {
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  Appointment.updateOne({_id: appointmentId}, data, (err, doc) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }
    
    if (!doc.n) {
      return res.status(404).json({
        success: false,
        data: 'Appointment Not Found',
      });
    }

    res.status(201).json({
        success: true,
      });
    });
}


AppointmentController.prototype = {
  all,
  create,
  remove,
  update,
};
  
module.exports = AppointmentController;