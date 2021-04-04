const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/auth',require('./Controllers/loginController'))

app.use('/api/membres',require('./Controllers/membresController'))
app.use('/api/municipalites',require('./Controllers/municipalitesController'))
app.use('/api/gouvernorats',require('./Controllers/gouvernoratController'))
app.use('/api/ministeres',require('./Controllers/ministeresController'))

app.use('/api/reunions',require('./Controllers/reunionsController'))

const Port = process.env.Port || 3000
app.listen(Port,() => console.log('server started'))

//app.listen(process.env.PORT || 3000) //Heroku Deployment

