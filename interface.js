
// EXTENSION DES IFRAMES AU SURVOL

var frameCalc;
var frameSvg;

function activer(cible){
cible.width = '90%' ;
cible.height = '700px' ;
}

function desactiver(cible){
cible.width = '5%' ;
cible.height = '250px' ;
}

function activerCalc(){
activer(frameCalc);
desactiver(frameSvg);
}

function activerSvg(){
activer(frameSvg);
desactiver(frameCalc);
}

function setFrames(){

frameCalc = document.getElementById('calcPage');
frameSvg = document.getElementById('svgPage');

frameCalc.addEventListener("mouseover", activerCalc);
frameSvg.addEventListener("mouseover", activerSvg);

}




