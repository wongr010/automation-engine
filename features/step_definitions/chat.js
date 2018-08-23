var {Given, When, Then} = require('cucumber');
var support = require('../support/utils');
var assert=require('assert');

//USED IN GREETING TEST
Given(/^the user has opened a Maple-enabled page$/, async function () {
	await support.chatBot.navigateToPage();
});

Given(/^the chat window is opened$/, async function () {
	await support.chatBot.chatWindowOpened();
});

Given(/^the user is logged in as ([^"]*)$/, async function(user){
	await support.chatBot.login(user);
})

When('the user selects {string}', async function (string) {
	await support.chatBot.selectAction(string);
});

//USED IN GREETING TEST
When ('the user inputs {string}', async function (string){

	await support.chatBot.chatInput(string);

});

When('the user selects the {string} button of the custom widget of type {string}', async function(stringA, stringB){
	await support.chatBot.selectCustomWidget(stringA, stringB);
});

When('the user inputs custom widget of type {string} with:', async function(string, table){
	await support.chatBot.inputCustomWidget(string, table);
});

When('the user selects configurable widget of type {string} with:', async function(string, table){
	await support.chatBot.selectConfigurableWidget(string, table);
});

//USED IN GREETING TEST
Then('the bot shows configurable widget of type {string} with:', async function(string, table){

	await support.chatBot.validateConfigWidget(string, table);

});

Then('the bot shows custom widget of type {string} with:', async function(string, table){

	await support.chatBot.validateCustomWidget(string, table);

});

//USED IN GREETING TEST
Then('the following actions are shown:', async function (table){

	await support.chatBot.validateActions(table);

});

Then('a list of the following {string} of type {string} is shown:', async function (widget, type, table){

	await support.chatBot.validateList(widget, type, table);

});

Then ('a carousel of the following {string} of type {string} is shown:', async function(widget, type, table){
	await support.chatBot.validateConfigWidgetCarousel(type, table);
});



//AESx SPECIFIC

Given(/^an ([^"]*) with title "([^"]*)" is present$/, async function (action, string){
	await support.chatBot.chatInput("hi");
	await support.chatBot.chatWindowOpened(); //try not to fail tests if chat bot is a bit laggy


});
