const {Selector} = require('testcafe');
var ReactSelector = require('testcafe-react-selectors').ReactSelector;

// Implementation file

function actionBarArrowRight() {
    return Selector('.carousel__next-button').with({boundTestRun: testController});
}


function url() {
    return `${process.env.e2e_maple_url}`;
}

async function navigateToPage(){
    await testController.navigateTo(url());
}

function chatBox() {
    return Selector('.chat-window').with({boundTestRun: testController});
}

async function chatWindowOpened(){
    var window=Selector('.chat-window').with({boundTestRun: testController});
    await testController.expect(window.exists).ok();
    var secondBubble=Selector('.textBubble').withText("Check out everything I can do in the menu at the top left, or choose from the options below.").with({boundTestRun: testController});
    var thirdBubble=Selector('.textBubble').withText("Let's get started!").with({boundTestRun: testController});

    await testController
    .expect(secondBubble.exists).ok()
    .expect(thirdBubble.exists).ok()

}

async function actionButtonNo(numVisible, totalVisible, action){
    const button=ReactSelector('t div div').find('.chat-window__content__chat-buttons').find('.inner-carousel').find('.carousel__slider-tray-wrapper').find('ul').with({boundTestRun: testController});
    for (var i=0; i<totalVisible; i++){
        var buttonText=await button.findReact('r').nth(i).with({boundTestRun: testController}).innerText;
        //console.log(buttonText);
        if (buttonText.includes(action)) break;
    }
    return i;
}

async function selectAction(text){
    text.replace('"', '');

    var numVisible=await getNumVisibleSlides();
    var total=await totalNumActions();
    var buttonIndex=await actionButtonNo(numVisible, total, text);

    var matchingAction=ReactSelector('t div div').find('.chat-window__content__chat-buttons').find('.carousel__slide').withText(text).with({boundTestRun: testController});

    const actionBarArrow=actionBarArrowRight();
    for (var i=0; i<buttonIndex+1-numVisible; i++){
        await testController.click(actionBarArrow);
    }

    await testController.click(matchingAction).catch((err) => { console.log(err); });

}

async function chatInput(text) {
    const chat= Selector('.chat-window__input').find('input');

    await testController
    .typeText(chat, text)
    .pressKey('enter');
}

function sampleActionButton(){
    return Selector('.carousel__slide').nth(1).with({boundTestRun: testController});
}

async function totalNumActions(){
    return await Selector('.carousel__slide').with({boundTestRun: testController}).count;
}

async function validateList(widget, type, table){
    var raw=table.raw();

    if (widget==="configurable widgets"){

        await validateConfigWidgetList(type, table);

    }
}

async function validateConfigWidget(type, table){

    var list;
    if (!Array.isArray(table))   list=table.raw();
    else list=table;

    var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').with({boundTestRun: testController}).count;

    const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1).with({boundTestRun: testController});
    var outerCSS='.'+type;
    const matchingDiv=bubbles.find(outerCSS);

    for (var i=0; i<list.length; i++){
        //console.log(list[i]);
        var css='.'+type+'__'+list[i][0];

        var divText=matchingDiv.find(css).withText(list[i][1]).with({boundTestRun: testController});
        await testController.expect( divText.exists ).ok();

    }

}

async function validateCustomWidget(type, table){
    var list;
    if (!Array.isArray(table))   list=table.raw();
    else list=table;

    var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').with({boundTestRun: testController}).count;

    const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1).with({boundTestRun: testController});
    var outerCSS='.'+type;
    const matchingDiv=bubbles.find(outerCSS);

    for (var i=0; i<list.length; i++){
        //console.log(list[i]);
        var css='.'+type+'__'+list[i][0];
        if (list[i][1]==="$TODAY"){
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            year = year.toString().substr(-2);
            list[i][1] = month + "/" + day+"/"+year;

        }
        if (list[i][1].includes("$TODAY_TEXT")){
          var date = new Date();
          var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var day = date.getUTCDate();
        var year = date.getUTCFullYear();
        var name = weekday[date.getDay()];
        var month=monthNames[date.getMonth()];

        var dateString=name+" "+month+" "+day+" "+year;
        console.log(dateString);
        list[i][1] = list[i][1].replace("$TODAY_TEXT", dateString);
      }
        var divText=await matchingDiv.find(css).withText(list[i][1]);
        await testController.expect( divText.exists ).ok();

    }

}

function getMessageFromHistory(){
    var element=Selector(() => {
        var b=document.getElementByClassName('textBubble').length;
        console.log(b);
        var w=document.getElementByClassName('textBubble')[b-1];
        w.scrollIntoView();

        return b;
    });
}

async function validateActions(table){
    var expected=table.raw();
    var list=[];
    var totalVisible=await totalNumActions();
    const button=ReactSelector('t div div').find('.chat-window__content__chat-buttons').find('.inner-carousel').find('.carousel__slider-tray-wrapper').find('ul').with({boundTestRun: testController});

    for (var i=0; i<totalVisible; i++){
        var buttonText=await button.findReact('r').nth(i).with({boundTestRun: testController}).innerText;

        list.push(buttonText);

    }

    var passed=true;
    if (expected.length!=list.length){
        passed=false;
    }
    else {
        list.sort();
        expected.sort();

        for (let i=0; i<list.length; i++){
            list[i] = list[i].replace(/[\n\r]/g, '');
            list[i].trim();
            if ((expected[i][0]).toString()!==list[i]) {
                passed=false;
                break;
            }
        }

    }
    await testController.expect(passed).ok();
}



async function validateConfigWidgetList(type, table){ //right now only supports detail chips

    var expected=table.raw();
    var list=[];
    var count_groups;

    var groups=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble').with({boundTestRun: testController});//.catch((err) => { console.log(err); });

    try{
        count_groups=await groups.count;
    }catch(error){
        console.log(JSON.stringify(error));
    }

    var bubbles;

    try{
        bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble').nth(count_groups-1).with({boundTestRun: testController});
    }catch(e) {
        console.log(JSON.stringify(e));
    }

    const css='.'+type;
    const widgetNum=await bubbles.find(css).with({boundTestRun: testController}).count;
    var list=[];
    for (var i=0; i<widgetNum; i++){
        const chip=await bubbles.find(css).nth(i).with({boundTestRun: testController}).innerText;
        list.push(chip);
    }

    var passed=true;
    if (expected.length!=list.length){
        console.log("number of chips was expected to be "+expected.length+", actually was "+list.length);
        passed=false;
    }
    else {
        list.sort();
        expected.sort();

        for (let i=0; i<list.length; i++){
            list[i] = list[i].replace(/[\n\r]/g, '');
            list[i].trim();
            if (!(list[i]).includes(expected[i][0])) {
                console.log(list[i]+" does not contain "+expected[i][0]);
                passed=false;
                break;
            }
        }

    }
    await testController.expect(passed).ok();
}

async function validateConfigWidgetCarousel(type, table){
    var expected=table.raw();
    var list=[];
    var count_groups;
    var groups=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble').with({boundTestRun: testController});

    try{
        count_groups=await groups.count;
    }catch(error){
        console.log(JSON.stringify(error));
    }

    var carousel=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble').nth(count_groups-1).find('.carousel').with({boundTestRun: testController});
    var widget=carousel.find('.'+type);

    var numSlides=await widget.count;
    var list=[];

    for (var i=0; i<numSlides; i++){
        var text=await widget.nth(i).innerText;
        //console.log(text);
        list.push(text);
    }

    var passed=true;
    if (expected.length!=list.length){
        console.log("number of chips was expected to be "+expected.length+", actually was "+list.length);
        passed=false;
    }
    else {
        list.sort();
        expected.sort();

        for (let i=0; i<list.length; i++){
            list[i] = list[i].replace(/[\n\r]/g, '');
            list[i].trim();
            if (!list[i].includes(expected[i][0])) {
                console.log(list[i]+" does not contain "+expected[i][0]);
                passed=false;
                break;
            }
        }

    }
    await testController.expect(passed).ok();

}

async function login(user){

    var username=Selector('.container').find('.modal-dialog').find('.visible-lg').find('#div-forms').find('form').find('div').nth(0).with({boundTestRun: testController})
    var password=Selector('.container').find('.modal-dialog').find('.visible-lg').find('#div-forms').find('form').find('div').nth(1).with({boundTestRun: testController})
    var userN;
    var pass;
    switch(user){
        case "manager":{
            userN=process.env.manager_user;
            pass=process.env.manager_pass;
            break;
        }
        case "regular user":{
            userN=process.env.user_user;
            pass=process.env.user_pass;
            break;
        }
        default:{
            userN=process.env.user_user;
            pass=process.env.user_pass;
        }
    }
    await testController
    .typeText(username, userN)
    .typeText(password, pass)
    .pressKey('enter')
}


async function getNumVisibleSlides(){
    var container=await Selector('.carousel__slider').with({boundTestRun: testController}).clientWidth;
    var button=await Selector('.carousel__slide').nth(1).with({boundTestRun: testController}).clientWidth;
    return container/button;
}

async function selectCustomWidget(name, type){


    var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').with({boundTestRun: testController}).count;

    const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1).with({boundTestRun: testController});
    var outerCSS='.'+type;
    const matchingDiv=bubbles.find(outerCSS);

    if (name=="Confirm"){
        var css='.'+type+'__confirm';
        var divText=await matchingDiv.find(css).withText(name);
        await testController.click( divText );
    }

}

async function selectConfigurableWidget(type, table){
    var list;
    if (!Array.isArray(table))   list=table.raw();
    else list=table;

    var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').with({boundTestRun: testController}).count;

    const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1).with({boundTestRun: testController});
    var outerCSS='.'+type;
    const matchingDiv=bubbles.find(outerCSS);

    for (var i=0; i<list.length; i++){
        //console.log(list[i]);
        var css='.'+type+'__'+list[i][0];

        var divText=await matchingDiv.find(css).withText(list[i][1]);
        await testController.click( divText );

    }
}

async function inputCustomWidget(type, table){
    var list;
    if (!Array.isArray(table))   list=table.raw();
    else list=table;

    var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').with({boundTestRun: testController}).count;

    const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1).with({boundTestRun: testController});
    var outerCSS='.'+type;
    const matchingDiv=bubbles.find(outerCSS);

    for (var i=0; i<list.length; i++){
        //console.log(list[i]);
        var css='.'+type+'__'+list[i][0];
        var divText=await matchingDiv.find(css);
        await testController
        .click(divText)
        .pressKey('ctrl+a delete')
        .typeText( divText, list[i][1] );

    }
}


//rename 'chatbot'
exports.chatBot = {

    url: url,
    selectAction:selectAction,
    chatInput: chatInput,
    getMessageFromHistory: getMessageFromHistory,
    validateActions: validateActions,
    validateConfigWidgetCarousel: validateConfigWidgetCarousel,
    chatWindowOpened: chatWindowOpened,
    navigateToPage: navigateToPage,
    validateList: validateList,
    validateConfigWidget: validateConfigWidget,
    validateCustomWidget: validateCustomWidget,
    login: login,
    selectCustomWidget: selectCustomWidget,
    inputCustomWidget: inputCustomWidget,
    selectConfigurableWidget:selectConfigurableWidget

};
