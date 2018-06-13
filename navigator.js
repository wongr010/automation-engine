import {Selector} from 'testcafe';
import {ReactSelector} from 'testcafe-react-selectors';


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

export async function findMatchingBubbleNo(text){
	const count_groups=await ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').count;
	const bubbles=ReactSelector('t div div').find('.chat-window__content').find('.chat-bubble__bubble-proper').nth(count_groups-1);
	const widget_count=await bubbles.find('div').findReact('t').withProps({name: "text"}).count;

	for (var i=0; i<widget_count; i++){
		const widget=bubbles.find('div').findReact('t').nth(i);
		const props=await widget.getReact();
		// const extract=JSON.stringify(props, null, 2);
		// const parsed=JSON.parse(extract);
		console.log(JSON.stringify(props['props']['widgetDSL']['data']['text']));
		if (JSON.stringify(props['props']['widgetDSL']['data']['text'])==='"'+text+'"'){ //a bit too hard coded rn
			console.log(i);
			return i;
		}
	}

	return i;
}

export async function findMatchingButtonNo(label){
	  const widgetTracker=ReactSelector('t div div').find('.chat-window__content__chat-buttons').findReact('t').withProps({className: 'carousel--button'});
		const props=await widgetTracker.getReact();
		const widgetNo=props['props']['widgets'].length;

		for (var i=0; i<widgetNo; i++){
			if (JSON.stringify(props['props']['widgets'][i]['data']['action'])==='"'+label+'"'){
				console.log(i);
				return i;
			}
		}

		return i;
}
