var frameCalc;
var frameSvg;

function activer(cible){
console.log('activation!');
cible.width = '90%' ;
cible.height = '700px' ;
}

function desactiver(cible){
console.log('desactivation!');
cible.width = '5%' ;
cible.height = '250px' ;
}

function activerCalc(){
'activation calc!'
activer(frameCalc);
desactiver(frameSvg);
}

function activerSvg(){
'activation svg!'
activer(frameSvg);
desactiver(frameCalc);
}

function setFrames(){
console.log('ON SET FRAMES');

frameCalc = document.getElementById('calcPage');
frameSvg = document.getElementById('svgPage');
console.log(frameCalc);
//pagecalc.addEventListener('mouseover', activer);

frameCalc.addEventListener("mouseover", activerCalc);
frameSvg.addEventListener("mouseover", activerSvg);

}




