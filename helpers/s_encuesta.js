var FBMessenger = require('fb-messenger');
var messenger = new FBMessenger('EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD');

const DB_CONEXION = require('./conexionMongo');

var valorAtencion = null;
var valorServicio = null;

const quickReplies = [
    {
        "content_type":"text",
        "title":"1",
        "payload":"1",
    },
    {
        "content_type":"text",
        "title":"2",
        "payload":"2",
    },
    {
        "content_type":"text",
        "title":"3",
        "payload":"3",
    },
    {
        "content_type":"text",
        "title":"4",
        "payload":"4",
    },
    {
        "content_type":"text",
        "title":"5",
        "payload":"5",
    }
];

function s_encuesta() {
};

s_encuesta.prototype.action = null;
s_encuesta.prototype.number = null;
s_encuesta.prototype.query = null;
s_encuesta.prototype.senderId = null;

s_encuesta.prototype.servicioEncuesta = function() {
    var action = this.action;
    var number = this.number;
    var query = this.query;
    var senderId = this.senderId;

    if (action === 'encuesta' && query === 'Claro') {
        messenger.sendQuickRepliesMessage(senderId,"Ingrese un valor para la atención por parte de Movistar", quickReplies,"REGULAR", function (err, body) {
            if (err) return console.error(err)
        });
    } else if (action === 'respuesta-encuesta' && number) {
        if (parseInt(number,10) > 0 && parseInt(number,10) < 6 && valorAtencion === null) {
            valorAtencion = number;
            messenger.sendQuickRepliesMessage(senderId,"Ingrese una calificación para el servicio de Movistar", quickReplies,"REGULAR", function (err, body) {
                if (err) return console.error(err)
            });
        } else if (parseInt(number,10) > 0 && parseInt(number,10) < 6 && valorServicio === null) {
            valorServicio = number;
            registroDB();
            messenger.sendTextMessage(senderId,"Gracias por su tiempo");
            valorAtencion = null;
            valorServicio = null;
        } else {
            messenger.sendQuickRepliesMessage(senderId,"Incorrecto. Ingrese nuevamente", quickReplies,"REGULAR", function (err, body) {
                if (err) return console.error(err)
            });
        }
    }
};

function registroDB() {
    var conexion = new DB_CONEXION();

    var atencion = valorAtencion;
    var servicio = valorServicio;

    conexion.setValorAtencion(atencion);
    conexion.setValorServicio(servicio);

    conexion.registro();
};

s_encuesta.prototype.setAction = function(action){
    this.action = action;
};

s_encuesta.prototype.setNumber = function(number){
    this.number = number;
};

s_encuesta.prototype.setQuery = function(query){
    this.query = query;
};

s_encuesta.prototype.setSenderId = function(senderId){
    this.senderId = senderId;
};

module.exports = s_encuesta;