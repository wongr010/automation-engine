import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';

export var numActions=0;
export var visibleActions=0;

export async function actionbarNavigator(label){
	var numMatching= await Selector('.button').count; //Selector is a promise, await makes it return number type

	for (var i=0; i<numMatching; i++){
		var currentButton=await Selector('.button').nth(i).textContent;

		//console.log(currentButton);
		 if (currentButton.indexOf(label)!== -1) {
			break;
		}
	}

	return i+1; //starting from 1 click
}

export async function findMatchingBubble(text){
	const count_groups=await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').count;
	const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1);
	const widget_count=await bubbles.find('div').findReact('t').withProps({name: "text"}).count;

	for (var i=0; i<widget_count; i++){
		const widget=bubbles.find('div').findReact('t').nth(i);
		const props=await widget.getReact();

		console.log(JSON.stringify(props['props']['widgetDSL']['data']['text']));
		if (JSON.stringify(props['props']['widgetDSL']['data']['text'])==='"'+text+'"'){ //a bit too hard coded rn
			console.log(i);
			break;
		}
	}

	return bubbles.find('div').findReact('t').withProps({name: "text"}).nth(i);
}

export async function findMatchingButtonNo(label){
		const carouselInfo=await ReactSelector('t div div').find('.chat-window__content__chat-buttons').findReact('t').withProps({className: 'carousel--button'}).getReact();

		//set the action bar state for this test
		numActions=carouselInfo['props']['totalSlides'];
		visibleActions=Math.floor(carouselInfo['props']['visibleSlides']);

	  const widgetTracker=ReactSelector('t div div').find('.chat-window__content__chat-buttons').findReact('t').withProps({className: 'carousel--button'});
		const props=await widgetTracker.getReact();
		const widgetNo=props['props']['widgets'].length;

		for (var i=0; i<widgetNo; i++){
			if (JSON.stringify(props['props']['widgets'][i]['data']['action'])==='"'+label+'"'){

				return i;
			}
		}

		return i;
}

export async function findMatchingButton(no){
	return ReactSelector('t div div').find('.chat-window__content__chat-buttons').find('.inner-carousel').find('.carousel__slider-tray-wrapper').find('ul').findReact('r').nth(no);

}

export async function findMatchingDetailChip(label){

	var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').count; //use this always right before 'count' will be used. It's always off by 1

	const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1);
	const chips=bubbles.findReact('t').nth(0).findReact('t').nth(1); //this means that there should only be 1 bubble before the chip group
	const props=await chips.getReact();

	const widgetNo=props['props']['widgets'].length;

	for (var i=0; i<widgetNo; i++){
		if (JSON.stringify(props['props']['widgets'][i]['data']['title'])==='"'+label+'"'){

			break;
		}
	}

	return chips.find('li').nth(i).findReact('t');

}

export async function findMatchingInfoChip(text){
	var count_groups= await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').count; //use this always right before 'count' will be used. It's always off by 1

	const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1);
	const chips=bubbles.findReact('t').nth(0).findReact('t').nth(1); //this means that there should only be 1 bubble before the chip group
	const props=await chips.getReact();

	const widgetNo=props['props']['widgets'].length;

	for (var i=0; i<widgetNo; i++){
		var action=(JSON.stringify(props['props']['widgets'][i]['action'])).toLowerCase(); //would have used 'title' but the phone number widget has no such attribute
		if (action.includes(text.toLowerCase())){

			break;
		}
	}

	return chips.find('li').nth(i).findReact('t');
}

export function getCarouselNext(){
	return Selector('.carousel__next-button'); //carousel next button should have this class
}

export async function getTextField(){
	return Selector('.chat-window__input');
}
