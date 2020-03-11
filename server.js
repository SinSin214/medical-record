const express = require('express');
const moment = require('moment');
const app = express();
const port = 3000 || process.env.PORT;
var mysql = require('mysql');
const bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Thesis"
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.post('/checkDoctor', (req, res) => {
  let data = req.body.address;
  con.connect(function() {
    let sql = "SELECT * FROM doctor where address='"+data+"'";
    con.query(sql, function (err, results) {
      if(results.length != 0){
        res.send('True');
      }
      else res.send('False');
    })
  })
});

app.post('/storeHistory', (req) => {
  let contract = req.body.contract;
  let doctor = req.body.doctor;
  let disease = req.body.disease;
  let date = moment().format("YYYY-MM-DD HH:mm:ss");;
  con.connect(function() {
    let sql = "INSERT INTO record (record, doctor, disease_name, date) VALUES ('"+contract+"','"+doctor+"','"+disease+"','"+date+"')";
    con.query(sql);
  })
});

app.get('/listDoctor', (req, res) => {
  con.connect(function(){
    let sql = "SELECT * FROM doctor";
    con.query(sql, function(err, data) {
      data.forEach(item => {
        item.join_date = moment(item.join_date).format("YYYY-MM-DD");
      })
      res.send(data);
    });
  })
})

app.post('/getRecord', (req, res) => {
  let record = req.body.record;
  con.connect(function() {
    let sql = "SELECT r.disease_name, r.date, d.name, d.address, d.email FROM record AS r LEFT JOIN doctor AS d ON r.doctor = d.address where r.record = '"+record+"'";
    con.query(sql, function(err, data) {
      if(data.length != 0){
      data[0].date = moment(data[0].date).format("YYYY-MM-DD");
      res.send(data);}
      else res.send(err);
    });
  })
});

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat chanel' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
