function CarteManager() {
	this.list_of_cartes = [];
	svg_loaded = false;
	csv_loaded = false;
}

CarteManager.prototype.load_template_svg = function (svg_file) {
	svg_loaded = true;
	this.template_svg = "";
}

CarteManager.prototype.load_csv = function (csv_file) {
	csv_loaded = true;
	this.parsed_csv = [[]];
	this.columns_headers = [];
}

CarteManager.prototype.create_cartes = function() {
	if (!svg_loaded) {
		throw Error("You should call load_template_svg before create_cartes");
	}

	if (!csv_loaded) {
		throw Error("You should call load_csv before create_cartes");
	}

	for (let csv_line of this.parsed_csv) {
		let carte = new Carte(this.columns_headers, csv_line, this.template_svg);
		this.list_of_cartes.push(carte);
	}
}

CarteManager.prototype.show_cartes = function() {
	for (let carte of this.list_of_cartes) {
		carte.show_cartes();
		document.write("--------------------------------");
	}
}
