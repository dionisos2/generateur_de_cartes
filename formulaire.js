var framacalcUrlTextBox ;
var calcUrl ;
var leCSV ;
var svgCanvas ;

function validateCalcUrl() {
	updateCalc(getCalcUrl());		
svgCanvas = new EmbeddedSVGEdit(window.frames.svgedit);
console.log(svgCanvas);
}

function updateCalc(laUrl){
if(document.getElementById('calcPage') != null) 
{
document.getElementById('calcPage').src = laUrl;
console.log("Framacalc chargé : " + getText) ;
}
else {console.log("iframe null") ; }
}

function getCalcUrl(){
    return document.getElementById('framacalcUrlTextBox').value;
}

function launchCSV(){
leCSV = calcUrl+'.csv';
console.log(leCSV);
}

function setForm(){
framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox');
var urlButton = document.getElementById('URLbutton');
urlButton.addEventListener('click', validateCalcUrl);
}

function setCSV(){
var csvButton = document.getElementById('CSVbutton');
csvButton.addEventListener('click', launchCSV);
}

function main(){
setCSV() ;
setForm() ;
}

