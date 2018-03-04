/*var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
}); */

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: 'ef92f9e7-6ca8-4ffc-80e1-969ffb61124b',
    appPassword: '#Pd0!PFfx[Ov+iT{'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('default', session.message.text);
});
bot.set('storage', tableStorage);
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName;

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.matches('AttendHackathon', (session) => {
    const possibleResponses = ["Nice to see that you love hackathons. Could you describe one of the projects you like the best?"];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
})
.matches('Collaborate', (session) => {
	const possibleResponses = ["Sounds good. So in terms of collaboration, have you been faced with a difficult situation in a team? How did you deal with that?"];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
})
.matches('Intern', (session) => {
	const possibleResponses = ["Can you tell me more about the intern project you just mentioned? What did you enjoy most about it?"];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
})
.matches('Leadership', (session) => {
	const possibleResponses = ["I see that you have a decent amount of leadership experience. Do you like to work in a team as a leader or as a member? Why?"];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
})
.matches('MachineLearning', (session) => {
	const possibleResponses = ["So you know about machine learning? What are some of the projects you have completed using machine learning?"];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
})
.onDefault((session) => {
	const possibleResponses = ["Nice!", "Good.", "Good job."];
    const rand = Math.floor(Math.rand() * possibleResponses);
    session.send(possibleResponses[rand], session.message.text);
});

bot.dialog('/', intents);