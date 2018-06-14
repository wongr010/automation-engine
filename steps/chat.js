var {Given, When, Then, BeforeAll, AfterAll} = require('cucumber');
var createTestFile=require('./testcreater').createTestFile;
var initTestFile=require('./testcreater').initTestFile;
var setActionBarVisible=require('./testcreater').setActionBarVisible;

const {spawn}=require('child_process');

let action; //the verb (click/type)
let actionItem; //the HTML element
let actionIdentifier; //text etc. identifying the element or being put into the element
let responseItem;
let responseIdentifier;
let testcounter=0;

BeforeAll(function(){
  console.log("IMPORTANT: Please start every test case with an action bar configuration test\n");
  initTestFile();
})


Given('I am chatting with Maple', function(input){

})

When(/^I type ([^"]*) into ([^"]*)$/, function(arg1, arg2){
  action="type";
  actionItem=arg2;
  actionIdentifier=arg1;
})

When(/^I click ([^"]*) with ([^"]*)$/, function(arg1, arg2){
  action="click";
  actionItem=arg1;
  actionIdentifier=arg2;
})

Then(/^there will be (.*) buttons visible$/, function(arg1){

  setActionBarVisible(arg1);
})

Then(/^I should see (.*) with (.*)$/, function(arg1, arg2){

  responseItem=arg1;
  responseIdentifier=arg2;

  createTestFile(action, actionItem, actionIdentifier, responseItem, responseIdentifier, testcounter);
  testcounter++;

})

AfterAll(function(){

  const child=spawn("powershell.exe", [__dirname+"//testscript.ps1"]);
  child.stdout.on("data",(data)=>{
    console.log("\tTest Result: " + data.toString());
  });

  child.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  child.on('exit', (code) => {
    console.log(`\tTest exited with code ${code}`);
  });
  return Promise.resolve();
});
