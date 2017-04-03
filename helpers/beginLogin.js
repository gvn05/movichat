const FACEBOOK_ACCESS_TOKEN = 'EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD';
const API_AI_TOKEN = 'e049a98c9832486b8cc6dfa7cede6662';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const wsM = require('./ws_miMovistarNode.js');

var FBMessenger = require('fb-messenger');
var messenger = new FBMessenger('EAAD30KXGsikBAEaA8t2OcLLEgnM2YxnIHvqTS2sAdtc0eBoFJ0qw46gwEZC4arHKNvi69Cypzhkp1DSwFdqZBf0XZA6yqQVNSHmiqEmtCgg1vXkFBoiZA34rgAof2MCklZAHV95pW7AS5CwT3glbia6ZAtwdXTWnQO2ysbmujpHAZDZD');

const request = require('request');

const checkWhiteList = (senderId) => {
   request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
				"setting_type": "domain_whitelisting",
				"whitelisted_domains": ["https://e84ea710.ngrok.io"],
				"domain_action_type": "add"
			}
    });
};

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
	
module.exports = (event) => {
	
	const senderId = event.sender.id;
	checkWhiteList(senderId);

	

	if(event.account_linking){
	
	messenger.getProfile(senderId, function (err, body) {
	  var genero = "Bienvenida ";
	  var  userpi;
		if (err) {
			return console.error(err)
			}
		else{
				if(body.gender === "female"){
					userpi = genero+body.first_name+"!";
				}
				else{
					genero = "Bienvenido ";
					userpi = genero+body.first_name +"!";
				}
			var indicaciones = "\n\nPuedes presionar una de las opciones o escribir lo que deseas hacer";
			messenger.sendQuickRepliesMessage(senderId,userpi+indicaciones, quickReplies,"REGULAR", function (err, body) {
			if (err) return console.error(err)
			});
			
		}		
		});
		//Se envía las opciones disponibles para el usuario
		
	
	 }	 
	 
};