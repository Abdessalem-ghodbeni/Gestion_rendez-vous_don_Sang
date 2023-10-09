

var mysql = require('mysql');
var nodemailer = require('nodemailer');
module.exports = {
  port: process.env.PORT || 3008,
  env: process.env.NODE_ENV || 'development',
  mediane: 6,

  pool: mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'slouma123',
    database: 'edonner',
    debug: false
  }),


  transporter : nodemailer.createTransport({
    service: 'Gmail',
    //host : 'smtp.gmail.com',
    auth: {
      user: 'blooddon801@gmail.com',
      pass: 'blooddon123'
    }
})
};



