var framacalcUrlTextBox ;
var svgTextBox ;
var calcUrl ;
var leCSV ;
var leSVG;
var svgEdit ;

function validateCalcButtonCallback() {
updateCalc(getCalcUrl());
}

function validateSVGButtonCallback() {
	leSVG = getSVGCode() ;
	var tmpSVG = "nothing" ;
//updateSVGPreview(leSVG);
console.log(svgEdit);
console.log("=== before ===") ;
svgEdit.svgToString() (function(data, error){
  if (error){
	console.log(error) ;
  } else{
	tmpSVG = data ;
} } );
console.log(tmpSVG);
console.log("=== after ===") ;
svgEdit.setSvgString(leSVG);
svgEdit.svgToString() (function(data, error){
  if (error){
	console.log(error) ;
  } else{
	tmpSVG = data ;
} } );
console.log(tmpSVG);
} 

function updateCalc(laUrl){
if(document.getElementById('calcPage') != null) 
{
document.getElementById('calcPage').src = laUrl;
console.log("Framacalc chargé : " + laUrl) ;
}
else {console.log("iframe null") ; }
}

function updateSVGPreview(leCodeSVG){
if(document.getElementById('svgPreview') != null) 
{
document.getElementById('svgPreview').innerHTML = leCodeSVG;
console.log("SVG preview chargé") ;
}
else {console.log("svgPreview null") ; }
}

function printCSVtoConsole(){
leCSV = calcUrl+'.csv';
console.log(leCSV);
}

function initForm(){

framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox');
framacalcUrlTextBox.value = "https://framacalc.org/test-minipen"

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
setFrames();
initForm() ;
if (window.frames[0] != null){
	svgEdit = new EmbeddedSVGEdit(window.frames[0]) ;
	console.log(svgEdit);
}
else {console.log("svgedit null") ; }
}

