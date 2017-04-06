const FACEBOOK_ACCESS_TOKEN = 'EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD';
const API_AI_TOKEN = 'e049a98c9832486b8cc6dfa7cede6662';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const wsM = require('./ws_miMovistarNode.js');

var FBMessenger = require('fb-messenger');
var messenger = new FBMessenger('EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD');

const request = require('request');

const consultaDB = require('./s_encuesta');
const consultaCentros = require('./s_ubicacion');

var latUser = null;
var lonUser = null;

var accionSolicitada = null;
var numeroIngresado = null;
var consultaRealizada = null;
var idSolicitante = null;

var celular1;

const quickRepliesExtra = [
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

const quickRepliesEncuesta = [
    {
        "content_type":"text",
        "title":"Claro",
        "payload":"Claro"
    },
    {
        "content_type":"text",
        "title":"No, gracias",
        "payload":"No, gracias"
    }
];
		
const checkWhiteList = (senderId) => {
   request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
				"setting_type": "domain_whitelisting",
				"whitelisted_domains": ["https://b5cdf0f3.ngrok.io"],
				"domain_action_type": "add"
			}
    });
};


const sendBeginButton = (senderId) => {
   request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
				 "setting_type":"call_to_actions",
				 "thread_state":"new_thread",
				 "call_to_actions":[
				{
				  "payload":"getStarted"
				}
				]
			}
		
    });
};

const buttons= [{"type":"account_link",
					"url": "https://b5cdf0f3.ngrok.io"}];

const quickReplies =[
    {
        "content_type":"text",
        "title":"Consultar mi saldo",
        "payload":"saldo",
    },
    {
        "content_type":"text",
        "title":"Ver centros cercanos",
        "payload":"centros",
    }
];
				
module.exports = (event, login, celular) => {
	celular1 = celular;
	const senderId = event.sender.id;
 	checkWhiteList(senderId);
    idSolicitante = senderId;
 	if (event.message.attachments && login === true) {
        latUser = event.message.attachments[0].payload.coordinates.lat;
        lonUser = event.message.attachments[0].payload.coordinates.long;
        enviarCentros();
    } else if(event.message.text) {
		const message = event.message.text;
		const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});
		apiaiSession.on('response', (response) => {
			const roberto = response.result.fulfillment.speech;		
			if (response.result.action === 'saludo'){
				messenger.sendButtonsMessage(senderId,roberto,buttons, 'REGULAR', function (err, body) {
				if (err) return console.error(err)
				});
			 }
			else if (response.result.action === 'saldo'&& login === true){
				MAD_CONSULTA_SALDO(function (aws) {
					var kathy="";
					if(aws.Controles[0].Data.saldo_plan===""){
						kathy ="\nNo tienes un plan Movistar activado";
					} else {
						kathy="\nPlan: "+aws.Controles[0].Data.saldo_plan;
					}				
					var resultBot5 = roberto + "\n"+aws.Controles[0].Data.saldo_recarga + kathy; 
					messenger.sendTextMessage(senderId, resultBot5, function(err,body) {
                        if (err) return console.error(err)
                            messenger.sendQuickRepliesMessage(senderId,"¿Deseas hacer algo más?", quickRepliesExtra,"REGULAR", function (err, body) {
                                if (err) return console.error(err)
                            });
                    });
				});
			}else if (response.result.action === 'ubicacion' && login === true) {
                messenger.sendTextMessage(senderId,roberto);
			} else if (response.result.action === 'encuesta' && response.result.resolvedQuery === 'Claro'  && login === true) {
                accionSolicitada = response.result.action;
                consultaRealizada = response.result.resolvedQuery;
                guardarEncuesta();
            } else if (response.result.action === 'respuesta-encuesta' && response.result.parameters.number && login === true) {
                accionSolicitada = response.result.action;
                numeroIngresado = response.result.parameters.number;
                guardarEncuesta();
            } else if (response.result.action === 'extra' && response.result.resolvedQuery === 'Sí'  && login === true) {
                console.log("Ya llegó aquí!");
                messenger.sendQuickRepliesMessage(senderId,"Por favor, presionar una de las opciones o escribir lo que deseas hacer", quickReplies,"REGULAR", function (err, body) {
                    if (err) return console.error(err)
                });
            } else if (response.result.action === 'extra' && response.result.resolvedQuery === 'No' && login === true) {
                messenger.sendQuickRepliesMessage(senderId,"¿Nos podrías ayudar con una encuesta?", quickRepliesEncuesta,"REGULAR", function (err, body) {
                    if (err) return console.error(err)
                });
            } else {
                messenger.sendTextMessage(senderId, "Gracias por su tiempo");
            }
			console.log("Action enviada: ",response.result.action);
		 });
		 apiaiSession.end();
	}
};

function MAD_CONSULTA_SALDO(catcher){
	var con = new wsM();
		con.setAccion('IMOVISTAR_DATOS_LINEA');
		var arg = {};
		arg.linea=celular1;		
		arg.keyid="home";
		console.log('Argumentos',arg);
		var session = {};
		session.imei="1234567890";
		session.version="2.2.28";
		session.id_session="0";
		console.log ('Session: ',session);
		con.setArgumentos(arg);
		con.setSession(session);
		con.servicio();
		
		con.setOnExito (catcher);
		con.setOnError (catcher);
};

function guardarEncuesta() {
    var cons = new consultaDB();

    var accion = accionSolicitada;
    var numero = numeroIngresado;
    var consulta = consultaRealizada;
    var sid = idSolicitante;

    cons.setAction(accion);
    cons.setNumber(numero);
    cons.setQuery(consulta);
    cons.setSenderId(sid);

    cons.servicioEncuesta();
};

function enviarCentros() {
    var ubic = new consultaCentros();

    var latU = latUser;
    var lonU = lonUser;

    ubic.setLatitud(latU);
    ubic.setLongitud(lonU);
    ubic.setSenderId(idSolicitante);

    ubic.servicioCentrosCercanos();
};