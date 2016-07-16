var framacalcUrlTextBox ;
var svgTextBox ;
var calcUrl ;
var leCSV ;
var leSVG;
var svgCanvas ;

function validateButtonCallback() {
updateCalc(getCalcUrl());
updateSVGPreview(getSVGCode());	
//svgCanvas = new EmbeddedSVGEdit(window.frames.svgedit);
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

function updateSVGPreview(leCodeSVG){
if(document.getElementById('svgPreview') != null) 
{
document.getElementById('svgPreview').svgCode = leCodeSVG;
console.log("SVG chargé : " + getText) ;
}
else {console.log("svgPreview null") ; }
}

function printCSVtoConsole(){
leCSV = calcUrl+'.csv';
console.log(leCSV);
}

function setForm(){
framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox');
svgTextBox = document.getElementById('svgTextBox');
var urlButton = document.getElementById('URLbutton');
urlButton.addEventListener('click', validateButtonCallback);
}

function setCSV(){
var csvButton = document.getElementById('CSVbutton');
csvButton.addEventListener('click', printCSVtoConsole);
}

function getCalcUrl(){
    return framacalcUrlTextBox.value;
}

function getSVGCode(){
    return svgTextBox.value;
}

function main(){
setCSV() ;
setForm() ;
}

