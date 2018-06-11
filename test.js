import {Selector} from 'testcafe';
import {ClientFunction} from 'testcafe';
import {actionbarNavigator, numClicksForButton} from './navigator';

fixture `chatbot test`
.page `https://d11a9vijqilt7q.cloudfront.net/`
.httpAuth({
username: "liquid",
password: "studio",
})

// test('test0', async t => {
// 		await t
// 		.typeText('.chat-window__input__input-box', 'hi')
// 		.expect((Selector('.button').withText('Phone details')).exists).ok()
// });
//
// test('test1', async t => {
// 		await t
// 		.typeText('.chat-window__input__input-box', 'howdy')
// 		.expect((Selector('.button').withText('Full name')).exists).ok()
// });

test('test2', async t => {

	try{
		numclicks=await actionbarNavigator('Personal info');
	} catch (error){
		console.trace();
	}
	for (var i=0; i<numclicks-2; i++){
		await t
		.click(Selector('.carousel__next-button'))
}
	await t
		.click(Selector('.button').withText('Personal info'))
		.expect((Selector('.textBubble').withText('To view your personal details, select an item below.')).exists).ok()
});

test('test3', async t => {
	var numclicks=0;
	try{
		numclicks=await actionbarNavigator('Nickname');
	} catch (error){
		console.trace();
	}
	for (var i=0; i<numclicks-2; i++){
		await t
		.click(Selector('.carousel__next-button'))
}
	await t
		.click(Selector('.button').withText('Nickname'))
		.expect((Selector('.maple-list__item').withText('Nickname')).exists).ok()
});
