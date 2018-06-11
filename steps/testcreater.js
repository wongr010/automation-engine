const fs = require('fs');

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
          'username: "liquid",\n'+
          'password: "studio",\n'+
        '})\n\n');
}



function createTestFile(action, actionItem, actionIdentifier, responseItem, responseIdentifier, testNo) {

    var testString="\t";
    var expectString="\n\t\t";
    var actionElement=dictionary[actionItem];
    var testTitle="test"+testNo.toString();


    if (action==="type"){
      testString=testString.concat(`\tawait t\n\t\t.typeText(\'${actionElement}\', \'${actionIdentifier}\')`);
    }

    if (action==="click"){
      if (actionItem==="action bar button"){
        testString=testString.concat(`for (var i=0; i<actionbarNavigator('${actionElement}')-2; i++){\n`);
        testString=testString.concat("\t\tawait t\n");
        testString=testString.concat("\t\t.click(Selector(\'.carousel__next-button\'))\n");
        testString=testString.concat("}");


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
  initTestFile: initTestFile
};
