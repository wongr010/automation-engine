const fs = require('fs');
const username=require('./auth').username;
const password=require('./auth').password;

var numVisible=0;

const dictionary={ //element to identifying class
  "action bar button": ".button", //these are in carousel
  "action bar buttons": ".button",
  "chat bar": ".chat-window__input__input-box",
  "chip": ".detailChip",
  "bubble": ".textBubble", //static things
  "personalItem": ".maple-list__item", //dynamic things
  "update bar": "input"

};

function initTestFile(){
  fs.writeFileSync('test.js',
      'import {Selector} from \'testcafe\';\n' +
      'import {ClientFunction} from \'testcafe\';\n' +
      'import {actionbarNavigator} from \'./navigator\';\n\n'+
      'fixture `chatbot test`\n' +
        '.page `https://d11a9vijqilt7q.cloudfront.net/`\n'+

        '.httpAuth({\n'+
          `username: "${username}",\n`+
          `password: "${password}",\n`+
        '})\n\n');
}

function setActionBarVisible(numVis){
  console.log("hello");
  numVisible=numVis;
}

function createTestFile(action, actionItem, actionIdentifier, responseItem, responseIdentifier, testNo) {

    var testString="";
    var expectString="\n\t\t";
    var actionElement=dictionary[actionItem];
    var testTitle="test"+testNo.toString();


    if (action==="type"){
      testString=testString.concat(`\tawait t\n\t\t.typeText(\'${actionElement}\', \'${actionIdentifier}\')`);
    }

    if (action==="click"){
      if (actionItem==="action bar button"){
        testString=testString.concat('\tvar numClicks=0;\n');
        testString=testString.concat('\ttry{\n');
        testString=testString.concat(`\t\tnumClicks=await actionbarNavigator('${actionIdentifier}');\n`);
        testString=testString.concat('\t} catch(error) {\n');
        testString=testString.concat('\t\tconsole.trace();\n');
        testString=testString.concat('\t}\n\n');

        testString=testString.concat(`\tfor (var i=0; i<numClicks-${numVisible}; i++){\n`);
        testString=testString.concat("\t\tawait t\n");
        testString=testString.concat("\t\t\t.click(Selector(\'.carousel__next-button\'))\n");
        testString=testString.concat("\t}");


        }

        testString=testString.concat(`\n\tawait t\n\t\t.click(Selector(\'${actionElement}\').withText(\'${actionIdentifier}\'))`);

      }


    var responseElement=dictionary[responseItem];

    expectString=expectString.concat(`.expect((Selector(\'${responseElement}\').withText(\'${responseIdentifier}\')).exists).ok()`);


    fs.appendFileSync('test.js', `test('${testTitle}', async t => {\n`+

      testString+
      expectString+"\n"+
    "});\n\n");


}

module.exports={
  createTestFile: createTestFile,
  initTestFile: initTestFile,
  setActionBarVisible: setActionBarVisible
};
