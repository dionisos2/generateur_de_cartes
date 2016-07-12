$(document).ready(function() {
	var carteManager = new CarteManager();
	carteManager.loadTemplateSvg("carte");
	carteManager.loadCsv('https://framacalc.org/test-minipen.csv');
	carteManager.createCartes();
	carteManager.showCartes();
});
