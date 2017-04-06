var FBMessenger = require('fb-messenger');
var messenger = new FBMessenger('EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD');

const MOVISTAR_WS = require('./ws_miMovistarNode.js');

const quickReplies = [
	{
		"content_type":"text",
		"title":"Sí",
		"payload":"Sí"
	},
	{
		"content_type":"text",
		"title":"No",
		"payload":"No"
	}
];

var latitudUsuario = null;
var longitudUsuario = null;

function s_ubicacion() {
};

s_ubicacion.prototype.latitud = null;
s_ubicacion.prototype.longitud = null;
s_ubicacion.prototype.senderId = null;

s_ubicacion.prototype.servicioCentrosCercanos = function() {
	latitudUsuario = this.latitud;
    longitudUsuario = this.longitud;
    var senderId = this.senderId;
    consultaCentrosCercanos(function(aws){
    	var resultado = [];            
        for (var i = 0; i < aws.marcas.length; i++) {
            resultado[i] = aws.marcas[i];
        }
        var elementos = [];
        for (var i = 0; i < resultado.length; i++) {
            reconstruccionLatitud = resultado[i].latitud.split(".");
            reconstruccionLongitud = resultado[i].longitud.split(".");
            if (reconstruccionLatitud[0] ===  "-") {
                reconstruccionLatitud[0] = reconstruccionLatitud[0].replace("-","-0");
            }
            if (reconstruccionLongitud[0] ===  "-") {
            	reconstruccionLongitud[0] = reconstruccionLongitud[0].replace("-","-0");
            }
            elementos[i] = {
                title: resultado[i].description + " - " + resultado[i].name,
                subtitle: resultado[i].address,
                image_url: resultado[i].url,
                buttons: [{
                    type: "web_url",
                    url: "http://maps.google.es/?q=" + reconstruccionLatitud[0] + "." + reconstruccionLatitud[1] + "%20" + reconstruccionLongitud[0] + "." + reconstruccionLongitud[1],
                    title: "Ubicación"
                }]
            };
        }
        messenger.sendHScrollMessage(senderId,elementos, function(err,body) {
            if (err) return console.error(err)
            	messenger.sendQuickRepliesMessage(senderId,"¿Deseas hacer algo más?", quickReplies,"REGULAR", function (err, body) {
            		if (err) return console.error(err)
        		});
        });
    });
};

function consultaCentrosCercanos(catcher) {
    var conexionMAD = new MOVISTAR_WS();    
    conexionMAD.setAccion("IMOVISTAR_TRAER_GEO_CERCANAS");

    var arg = {};
    arg.latitud = latitudUsuario;
    arg.longitud = longitudUsuario;
    arg.filtro = "1";

    var session = {};
    session.imei="1234567890";
    session.version="2.2.28";
    session.id_session=1811903;

    conexionMAD.setArgumentos(arg);
    conexionMAD.setSession(session);

    conexionMAD.servicio();

    conexionMAD.setOnExito(catcher);
};

s_ubicacion.prototype.setLatitud = function(latitud){
    this.latitud = latitud;
};

s_ubicacion.prototype.setLongitud = function(longitud){
    this.longitud = longitud;
};

s_ubicacion.prototype.setSenderId = function(senderId){
    this.senderId = senderId;
};

module.exports = s_ubicacion;