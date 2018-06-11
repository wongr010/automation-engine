// var writing;
// var text;
//
// module.exports={
//   varChecker: varChecker
// };
//
// function varChecker(w, t){
//   writing=w;
//   text=t;
//   console.log(writing+" "+text);
// }

import {Selector} from 'testcafe';
import {ClientFunction} from 'testcafe';


fixture `chatbot test`
  .page `https://d11a9vijqilt7q.cloudfront.net/`
  .httpAuth({
    username: 'liquid',
    password: 'studio'
  });

test('greeting test', async t=>{
  const chatbubbles=Selector('.textBubble');
  const chatbuttons=Selector('._slideInner_fhwgk_1');

  await t
    .expect(chatbubbles.nth(0).innerText).eql('Hi Jimmy, welcome! I\'m a virtual agent, here to help you with all of your HR related tasks.\n')
    .expect(chatbubbles.nth(1).innerText).eql('I can help you view and modify your personal information and so much more!!!\n')
    .expect(chatbuttons.nth(0).innerText).eql('Personal info\n')
    .expect(chatbuttons.nth(1).innerText).eql('Phone details\n')
    .click(Selector('.carousel__next-button'))
    .click(Selector('.carousel__next-button'))
    .expect(chatbuttons.nth(2).innerText).eql('Full name\n')
    .expect(chatbuttons.nth(3).innerText).eql('Nickname\n')
    .click(Selector('.carousel__next-button'))
    .click(Selector('.carousel__next-button'))
    .expect(chatbuttons.nth(4).innerText).eql('Addresses\n')
    .expect(chatbuttons.nth(5).innerText).eql('Marital status\n');

})

test('personal info test', async t=>{

 })
