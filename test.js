$(document).ready(function() {
	$( "#CSVbutton" ).click(function() {
		showCartes();
	});
});

function showCartes() {
	var carteManager = new CarteManager();
	carteManager.loadTemplateSvg("carte");
	csvUrl = $("#calcPage").attr("src") + ".csv";
	carteManager.loadCsv(csvUrl);
	carteManager.createCartes();
	carteManager.showCartes();
}
