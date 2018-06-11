import {Selector} from 'testcafe';

export async function numClicksForButton(label){
	var numClicks=0;
	try{
		numclicks=await actionbarNavigator(label);
	} catch (error){
		console.trace();
	}
	return numClicks;
}

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
