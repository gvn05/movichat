const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => console.log('Servidor para MoviChat en funcionamiento. Puerto: 5000'));

app.get('/', verificationController);
app.post('/', messageWebhookController);

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {  
    res.sendfile('./public/index.html');
    console.log("Salió!");
});
