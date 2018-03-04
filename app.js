var restify = require('restify');
var builder = require('botbuilder');

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

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

var luisAppId = '1a5d0a97-d862-4549-a829-753db7d68805';
var luisAPIKey = 'dbee4f8dbed244cc9ef3e8f9fd8665ae';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.matches('AttendHackathon', (session) => {
	console.log("AttendHackathon");
    const possibleResponses = ["Nice to see that you love hackathons. Could you describe one of the projects you like the best?"];
    const rand = Math.floor(Math.random() * possibleResponses.length);
    session.send(possibleResponses[rand]);
})
.matches('Collaborate', (session) => {
	console.log("Collaborate");
	const possibleResponses = ["Sounds good. So in terms of collaboration, have you been faced with a difficult situation in a team? How did you deal with that?"];
    const rand = Math.floor(Math.random() * possibleResponses.length);
    session.send(possibleResponses[rand]);
})
.matches('Intern', (session) => {
	console.log("Intern");
	const possibleResponses = ["Can you tell me more about the intern project you just mentioned? What did you enjoy most about it?"];
    const rand = Math.floor(Math.random() * possibleResponses.length);
    session.send(possibleResponses[rand]);
})
.matches('Leadership', (session) => {
	console.log("Leadership");
	const possibleResponses = ["I see that you have a decent amount of leadership experience. Do you like to work in a team as a leader or as a member? Why?"];
    const rand = Math.floor(Math.random() * possibleResponses.length);
    session.send(possibleResponses[rand]);
})
.matches('MachineLearning', (session) => {
	console.log("MachineLearning");
	const possibleResponses = ["So you know about machine learning? What are some of the projects you have completed using machine learning?"];
    const rand = Math.floor(Math.random() * possibleResponses.length);
    session.send(possibleResponses[rand]);
})
.matches('None', (session) => {
	console.log("No match");
    session.send("No match");
})
.onDefault((session) => {
	console.log("Default");
	const possibleResponses = ["Nice!", "Good.", "Good job."];
    const rand = Math.floor(Math.random() * possibleResponses);
    session.send(possibleResponses[rand]);
});

bot.dialog('/', intents);