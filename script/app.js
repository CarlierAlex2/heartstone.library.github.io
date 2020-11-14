const API_HEARTSTONE = "https://omgvamp-hearthstone-v1.p.rapidapi.com";
const KEY_RAPIDAPI = "33cfbd2fd6mshd1b64af868129a8p1a7089jsn81904d09c905";
const HOST_RAPIDAPI = "omgvamp-hearthstone-v1.p.rapidapi.com";
const TEST_CARD_ID_01 = "EX1_591"
const TEST_CARD_ID_02 = "EX1_050"

let html_CardImage;
let html_SearchBar, html_SearchList, html_SearchButton;
let html_CardName, html_CardSet, html_CardText;
let html_Cost, html_Attack, html_Health;
let currentCard;
let listCards;
let defaultImage;

const MAX_HEALTH = 10;
const MAX_ATTACK = 10;
const MAX_COST = 10;


//============================================================================================================================================================
const callbackCardById = function(jsonObject){
	let card = jsonObject["0"];
	console.log(card);
	showCard(card);
};

const callBackDefaultImage = function(jsonObject){
	let card = jsonObject[0];
	defaultImage = card["img"];
};

const callbackCardList = function(jsonObject){
	console.log(jsonObject);

};

const callbackSearch = function(jsonObject){
	console.log(jsonObject);
	fillSearchList(jsonObject);

	//getCardyId(cardId);
};

const fillSearchList = function(list){
	let listFound = [];
	let listContentHtml = "";


	for (const card of list) {
		if(card.hasOwnProperty("img"))
		{
			console.log(card);
			listFound.push(card);
		}
		if(listFound.length >= 5)
		{
			break;
		}
	}

	console.log(`Fill list - length: ${listFound.length}`);
	for (const card of listFound)
	{
		let cardId = card["cardId"];
		let cardName = card["name"];
		listContentHtml += `<li data-cardId="${cardId}">${cardName}</li>`;
	}

	html_SearchList.innerHTML = listContentHtml;
	listenToSelectSearched(html_SearchList);
};

const setBarPercentage = function(html_object, statValue, statMax){
	html_fill = html_object.querySelector(".js-progress__fill");
	html_fill.style.width = `${(statValue / statMax) * 100}%`;
};


const showCard = function(card){
	currentCard = card;
	let health = 0;
	let cost = 0;
	let attack = 0;

	if(card.hasOwnProperty("img")){
		html_CardImage.src = card["img"];
	}
	else
	{
		html_CardImage.src = defaultImage;
	}
	html_CardImage.alt = `Card image of ${card["name"]}`;

	if(card.hasOwnProperty("health")){
		health = card["health"];
	}
	if(card.hasOwnProperty("attack")){
		attack = card["attack"];
	}
	if(card.hasOwnProperty("cost")){
		cost = card["cost"];
	}

	/*
	html_CardName.innerHTML = card["name"];
	html_CardSet.innerHTML = card["cardSet"];
	html_CardText.innerHTML = card["text"];
	*/

	setBarPercentage(html_Health, health, MAX_HEALTH);
	setBarPercentage(html_Attack, attack, MAX_ATTACK);
	setBarPercentage(html_Cost, cost, MAX_COST);
};

const consoleCard = function(card)
{
	const name = card["name"];
	const cardSet = card["cardSet"];
	const cardType = card["type"];

	const faction = card["faction"];
	const rarity = card["rarity"];

	const cost = card["cost"];
	const attack = card["attack"];
	const health = card["health"];

	const text = card["text"];
	const flavor = card["flavor"];
	const artist = card["artist"];
	const collectible = card["collectible"];
	const playerClass = card["playerClass"];

	const img = card["img"];
	const imgGold = card["imgGold"];
	const locale = card["locale"];

	console.log(`name - ${name}`);
	console.log(`cardSet - ${cardSet}`);
	console.log(`cardType - ${cardType}`);

	console.log(`faction - ${faction}`);
	console.log(`rarity - ${rarity}`);

	console.log(`cost - ${cost}`);
	console.log(`attack - ${attack}`);
	console.log(`health - ${health}`);

	console.log(`text - ${text}`);
	console.log(`flavor - ${flavor}`);
	console.log(`artist - ${artist}`);
	console.log(`collectible - ${collectible}`);
	console.log(`playerClass - ${playerClass}`);

	console.log(`img - ${img}`);
	console.log(`imgGold - ${imgGold}`);
	console.log(`locale - ${locale}`);
};

const callBackLog = function(responseLog){
	console.log(responseLog);
};



//============================================================================================================================================================
const handleData = function(url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
	fetch(url, {
	  method: method,
	  body: body,
	  headers: {"x-rapidapi-key": `${KEY_RAPIDAPI}`, "x-rapidapi-host": `${HOST_RAPIDAPI}`, 'content-type': 'application/json'}
	})
	  .then(function(response) {
		if (!response.ok) {
		  console.warn(`>> Probleem bij de fetch(). Statuscode: ${response.status}`);
		  if (callbackErrorFunctionName) {
			console.warn(`>> Callback errorfunctie ${callbackErrorFunctionName.name}(response) wordt opgeroepen`);
			callbackErrorFunctionName(response); 
		  } else {
			console.warn('>> Er is geen callback errorfunctie meegegeven als parameter');
		  }
		} else {
		  console.info('>> Er is een response teruggekomen van de server');
		  return response.json();
		}
	  })
	  .then(function(jsonObject) {
		if (jsonObject) {
		  console.info('>> JSONobject is aangemaakt');
		  console.info(`>> Callbackfunctie ${callbackFunctionName.name}(response) wordt opgeroepen`);
		  callbackFunctionName(jsonObject);
		}
	  });
};


const getInfo = function() {
	console.log("Get Info fetch");
	handleData(`${API_HEARTSTONE}/info`, callBackLog, callBackLog, "GET");


};

const getDefaultCard = function(cardId) {
	handleData(`${API_HEARTSTONE}/cardbacks`, callBackDefaultImage, callBackLog, "GET");
};

const getCardyId = function(cardId) {
	console.log("Get CardById fetch");
	handleData(`${API_HEARTSTONE}/cards/${cardId}`, callbackCardById, callBackLog, "GET");
};

const getCardList = function(){
	console.log("Get all cards fetch");
	handleData(`${API_HEARTSTONE}/cards`, callbackCardList, callBackLog, "GET");
};

const getCardSearchName = function(name){
	console.log("Get card by name fetch");
	handleData(`${API_HEARTSTONE}/cards/search/${name}`, callbackSearch, callBackLog, "GET");
};

const listenToSearch = function(){
	html_SearchButton.addEventListener("click", function() {
		const name = html_SearchBar.value;
		getCardSearchName(name);
	  }); 
};

const listenToSelectSearched = function(list){
	list.removeEventListener("click", eventShowCard); 
	list.addEventListener("click", eventShowCard); 
};

const eventShowCard = function(event){
	if(event.target && event.target.nodeName == "LI") 
	{
		const item = event.target;
		console.log(item + " was clicked");
		const cardId = item.getAttribute("data-cardId"); ;
		getCardyId(cardId);
	}
}


//============================================================================================================================================================
const getHtmlElements = function(){
	html_CardImage = document.querySelector('.js-card__image');

	html_SearchBar = document.querySelector('.js-search__bar');
	html_SearchList = document.querySelector('.js-search__list');
	html_SearchButton = document.querySelector('.js-search__btn');

	html_Health = document.querySelector('.js-health');
	html_Attack = document.querySelector('.js-attack');
	html_Cost = document.querySelector('.js-cost');

	/*
	html_CardName = document.querySelector('.js-card__name');
	html_CardSet = document.querySelector('.js-card__set');
	html_CardText = document.querySelector('.js-card__text');
	*/
};




document.addEventListener('DOMContentLoaded', function() {
	getHtmlElements();

	getInfo();
	getDefaultCard();
	//getCardSearchName("a");
	//getCardyId(TEST_CARD_ID_01);
	//getCardyId(TEST_CARD_ID_02);

	listenToSearch();
});

