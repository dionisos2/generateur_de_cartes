function Carte(columns_headers, parsed_csv, template_svg) {
	if (columns_headers.length != parsed_csv.length) {
        throw new Error("columns_headers and parsed_csv doesn’t have the same length");
    }
	this.columns_headers = columns_headers;
	this.parsed_csv = parsed_csv;
	this.create_svg(template_svg);
}

Carte.prototype.create_svg = function (template_svg) {
	this.svg = template_svg; //copy by value ?

	for (i = 0; i < this.columns_headers.length; i++) {
		// replace all entries by their associated values
		this.svg.replace(this.columns_headers[i], this.parsed_csv[i]);
	}
}

Carte.prototype.show_cartes = function () {
	for (i = 0; i < this.columns_headers.length; i++) {
		document.write(this.column_headers[i] + " = " + this.parsed_csv[i]);
	}
}
