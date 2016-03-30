var express = require('express');
var querystring = require('querystring');
var Twitter = require('twitter');

var app = express();

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var tweetsRouter = require('./src/routes/tweetRoutes');


app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/tweets', tweetsRouter);

app.get('/', function(req, res){
//res.send('Hello');
res.render('index');
});

app.get('about', function(req, res){
res.send('Hello');
});

app.listen(port, server_ip, function(err){
console.log('Server is running on: ' + server_ip +':' + port);
});
