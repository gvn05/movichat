
//var con = new ws_miMovistar();
const FACEBOOK_ACCESS_TOKEN = 'EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD';
const API_AI_TOKEN = 'e049a98c9832486b8cc6dfa7cede6662';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const usuario='{"args":{"documentoID":"984057918","clave":"qwe123","perfilUsuario":"Numero"},"session":{"imei":"1234567890","version":"2.2.28","id_session":0},"funcion":"IMOVISTAR_LOGIN"}';
const objetoUsuario =JSON.parse(usuario);
const wsM = require('./ws_miMovistarNode.js');

var FBMessenger = require('fb-messenger');
var messenger = new FBMessenger('EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD');

const request = require('request');

const base = require('./conexionMongo');

var latUser = null;
var lonUser = null;

var valorAte = null;
var valorSer = null;

var celular1;

//messenger.sendTextMessage(<ID>, 'Hello') // Send a message with NO_PUSH, no callback

// Send an image overriding default notification type with callback

const sendTextMessage = (senderId, text) => {
	var text1 = text;
   request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {id: senderId },
			message: {text: text1},
            
        }
    });
};

function sendQuickReplay (senderId){
	return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: 
				[ { type: 0, speech: 'Su saldo es:' },
				{ title: 'Nos ayudaría con una encuesta, por favor?',
				  replies: [ 'Sí,claro', 'No por el momento' ],
				 type: 2 } ]
        }
    });	
};

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: messageData      
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });  
}

function sendQuickEncuesta(senderId, mensaje) {
    var messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: mensaje,
            quick_replies:[
                {
                    content_type: 'text',
                    title: 1,
                    payload: 1
                },
                {
                    content_type: 'text',
                    title: 2,
                    payload: 2
                },
                {
                    content_type: 'text',
                    title: 3,
                    payload: 3
                },
                {
                    content_type: 'text',
                    title: 4,
                    payload: 4
                },
                {
                    content_type: 'text',
                    title: 5,
                    payload: 5
                }
            ]
        }
    };
    callSendAPI(messageData);
}

function sendQuickExtra(senderId, mensaje) {
    var messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: mensaje,
            quick_replies:[
                {
                    content_type: 'text',
                    title: 'Sí',
                    payload: 'Sí'
                },
                {
                    content_type: 'text',
                    title: 'No',
                    payload: 'No'
                }
            ]
        }
    };
    callSendAPI(messageData);
}

function sendQuickEmpezarEncuesta(senderId, mensaje) {
    var messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: mensaje,
            quick_replies:[
                {
                    content_type: 'text',
                    title: 'Claro',
                    payload: 'Claro'
                },
                {
                    content_type: 'text',
                    title: 'No, gracias',
                    payload: 'No, gracias'
                }
            ]
        }
    };
    callSendAPI(messageData);
}

//FUNCIÓN DE SALUDO
	function createGreetingApi(data) {
		request({
		uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
		qs: { access_token: PAGE_ACCESS_TOKEN },
		method: 'POST',
		json: data

		}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		  console.log("Greeting set successfully!");
		} else {
		  console.error("Failed calling Thread Reference API", response.statusCode,     response.statusMessage, body.error);
		}
		});  
		};

		
const checkWhiteList = (senderId) => {
   request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
				"setting_type": "domain_whitelisting",
				"whitelisted_domains": ["https://ee487d9d.ngrok.io"],
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
					"url": "https://ee487d9d.ngrok.io"}];

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

 	if (event.message.attachments && login === true) {
        latUser = event.message.attachments[0].payload.coordinates.lat;
        lonUser = event.message.attachments[0].payload.coordinates.long;
        consultar(function(aws){
            var resultado = [];            
            for (var i = 0; i < aws.marcas.length; i++) {
                resultado[i] = aws.marcas[i];
            }            
            var carrusel = [];
            for (var i = 0; i < resultado.length; i++) {
                newLat = resultado[i].latitud.split(".");
                newLon = resultado[i].longitud.split(".");
                if ((newLat[0] ===  "-") || (newLat[0] ===  "-"))
                    newLat[0] = newLat[0].replace("-","-0");
                carrusel[i] = {
                    title: resultado[i].description + " - " + resultado[i].name,
                    subtitle: resultado[i].address,
                    image_url: resultado[i].url,
                    buttons: [{
                        type: "web_url",
                        url: "http://maps.google.es/?q=" + newLat[0] + "." + newLat[1] + "%20" + newLon[0] + "." + newLon[1],
                        title: "Ubicación"
                    }]
                };
            }
            messenger.sendHScrollMessage(senderId,carrusel, function(err,body) {
                if (err) return console.error(err)
                    sendQuickExtra(senderId,"¿Deseas hacer algo más?");
            });
        });
    }
	
	if(event.message.text)
	{
		const message = event.message.text;
		const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});
		apiaiSession.on('response', (response) => {
			const roberto = response.result.fulfillment.speech;		
			 //sendTextMessage(senderId,"Hola");	
			 
			if (response.result.action === 'saludo'){
				 //Botón de vinculación de cuentas
				//var mensaje = "Por favor accede con tu número y contraseña Movistar";
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
                            sendQuickExtra(senderId,"¿Deseas hacer algo más?");
                    });
				});
			}else if (response.result.action === 'ubicacion' && login === true) {
                sendTextMessage(senderId,roberto);
			} else if (response.result.action === 'encuesta' && response.result.resolvedQuery === 'Claro'  && login === true) {
                sendQuickEncuesta(senderId, "Ingrese un valor para la atención por parte de Movistar");
            } else if (response.result.action === 'respuesta-encuesta' && response.result.parameters.number && login === true) {
                var resp = response.result.parameters.number;

                if (parseInt(resp,10) > 0 && parseInt(resp,10) < 6 && valorAte === null  && login === true) {
                    valorAte = resp;
                    sendQuickEncuesta(senderId, "Ingrese una calificación para el servicio de Movistar");
                } else if (parseInt(resp,10) > 0 && parseInt(resp,10) < 6 && valorSer === null  && login === true) {
                    valorSer = resp;
                    registrar();
                    sendTextMessage(senderId, "Gracias por su tiempo");
                    valorAte = null;
                    valorSer = null;
                } else if (login === true) {
                    sendQuickEncuesta(senderId, "Incorrecto. Ingrese nuevamente");
                }                
            } else if (response.result.action === 'extra' && response.result.resolvedQuery === 'Sí'  && login === true) {
                console.log("Ya llegó aquí!");
                messenger.sendQuickRepliesMessage(senderId,"Por favor, presionar una de las opciones o escribir lo que deseas hacer", quickReplies,"REGULAR", function (err, body) {
                    if (err) return console.error(err)
                });
            } else if (response.result.action === 'extra' && response.result.resolvedQuery === 'No' && login === true) {
                sendQuickEmpezarEncuesta(senderId,"¿Nos podrías ayudar con una encuesta?");
            } else {
                sendTextMessage(senderId, "Gracias por su tiempo");
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

function consultar(catcher) {
    var con = new wsM();    
    con.setAccion("IMOVISTAR_TRAER_GEO_CERCANAS");

    var arg = {};
    arg.latitud = latUser;
    arg.longitud = lonUser;
    arg.filtro = "1";

    var session = {};
    session.imei="1234567890";
    session.version="2.2.28";
    session.id_session=1811903;

    con.setArgumentos(arg);
    con.setSession(session);

    con.servicio();

    con.setOnExito(catcher);
};

function registrar() {
    var reg = new base();

    var ate = valorAte;
    var ser = valorSer;

    reg.setValorAtencion(ate);
    reg.setValorServicio(ser);

    reg.registro();
};