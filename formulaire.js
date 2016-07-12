var textForm;
var calcUrl;
var leCSV;

function updateCalc(laUrl){
	document.getElementById('calcPage').src = laURL;
}

function getCalcUrl(){
    var getText = document.getElementById('textForm').value;
	console.log("Voilà la récupération : ");
	console.log(getText);
	calcUrl = getText;
	//updateCalc(calcUrl);
	document.getElementById('calcPage').src = getText;
	return getText;
}

function launchCSV(){
	leCSV = calcUrl+'.csv';
	console.log(leCSV);
}

function setForm(){
	textForm = document.getElementById('textForm');
	var urlButton = document.getElementById('URLbutton');
	urlButton.addEventListener('click', getCalcUrl);
}

function setCSV(){
	var csvButton = document.getElementById('CSVbutton');
	csvButton.addEventListener('click', launchCSV);
}

function main(){
	setCSV();
	setForm();
}

