function Carte(columnsHeaders, parsedCsv, templateSvg) {
	if (columnsHeaders.length != parsedCsv.length) {
        throw new Error("columnsHeaders and parsedCsv doesn’t have the same length");
    }
	this.columnsHeaders = columnsHeaders;
	this.parsedCsv = parsedCsv;
	this.createSvg(templateSvg);
}

Carte.prototype.createSvg = function (templateSvg) {
	this.svg = templateSvg; //copy by value ?

	for (i = 0; i < this.columnsHeaders.length; i++) {
		// replace all entries by their associated values
		this.svg.replace(this.columnsHeaders[i], this.parsedCsv[i]);
	}
}

Carte.prototype.showCartes = function () {
	for (i = 0; i < this.columnsHeaders.length; i++) {
		console.log(this.columnsHeaders[i] + " = " + this.parsedCsv[i]);
	}
}
