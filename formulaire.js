var framacalcUrlTextBox ;
var svgTextBox ;
var calcUrl ;
var leCSV ;
var leSVG;
var svgCanvas ;

function validateCalcButtonCallback() {
updateCalc(getCalcUrl());
}

function validateSVGButtonCallback() {
updateSVGPreview(getSVGCode());	
//svgCanvas = new EmbeddedSVGEdit(window.frames.svgedit);
//console.log(svgCanvas);
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
document.getElementById('svgPreview').innerHTML = leCodeSVG;
console.log("SVG chargé : " + getText) ;
}
else {console.log("svgPreview null") ; }
}

function printCSVtoConsole(){
leCSV = calcUrl+'.csv';
console.log(leCSV);
}

function initForm(){
framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox');
framacalcUrlTextBox = "https://framacalc.org/test-minipen"

svgTextBox = document.getElementById('svgTextBox');
svgTextBox.value = '<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><!-- Created with SVG-edit - http://svg-edit.googlecode.com/ --><g><title>Layer 1</title><rect id="svg_1" height="3" width="0" y="77" x="169" stroke-width="5" stroke="#000000" fill="#FF0000"/><rect id="svg_2" height="289" width="200" y="78" x="168" stroke-width="5" stroke="#000000" fill="#FF0000"/><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" id="svg_3" y="110" x="266" stroke-width="0" stroke="#000000" fill="#000000">Titre carte</text></g></svg>'

var validateCalcButton = document.getElementById('validateCalcButton');
validateCalcButton.addEventListener('click', validateCalcButtonCallback);

var validateSVGButton = document.getElementById('validateSVGButton');
validateSVGButton.addEventListener('click', validateSVGButtonCallback);

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
initForm() ;
}

