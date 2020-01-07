const express = require('express');
const cors = require('cors');

const db = require('./core/db');
const { patientValidation, appointmentValidation } = require('./utils/validation');
const { PatientCtrl, AppointmentCtrl } = require('./controllers');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
  res.send('Hello');
});

app.get('/patients', PatientCtrl.all);
app.post('/patients', patientValidation.create, PatientCtrl.create);
app.delete('/patients/:id', PatientCtrl.remove);
app.patch('/patients/:id', patientValidation.create, PatientCtrl.update);
app.get('/patients/:id', PatientCtrl.one);

app.get('/appointments', AppointmentCtrl.all);
app.post('/appointments', appointmentValidation('create'), AppointmentCtrl.create);
app.delete('/appointments/:id', AppointmentCtrl.remove);
app.patch('/appointments/:id', appointmentValidation('update'), AppointmentCtrl.update);

app.listen(6666, (err) => {
  if (err) {
    console.log('Port 6666 - is not available');
  }

  console.log('Server starts on 6666 port');
})