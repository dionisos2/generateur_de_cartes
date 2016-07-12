function Carte(columnsHeaders, parsedCsv, templateSvg) {
	if (columnsHeaders.length != parsedCsv.length) {
        throw new Error("columnsHeaders and parsedCsv doesn’t have the same length");
    }
	this.columnsHeaders = columnsHeaders;
	this.parsedCsv = parsedCsv;
	// this.createSvg(templateSvg);
}

Carte.prototype.createSvg = function (templateSvg) {
	this.svg = templateSvg; //copy by value ? (should be)
	var textPrefix = "GDCBOX";
	var boxPostfix = "BOX";

	for (i = 0; i < this.columnsHeaders.length; i++) {
		// replace all entries by their associated values
		svgText = getElementByValue(this.svg, this.columnsHeaders[i]);
		if (svgText.id.match("$" + textPrefix + ".*") != null) {
			boxId = svgText.id + boxPostfix;
			svgBox = getElementById(this.svg, boxId);
			this.addTextInBox(svgText, svgBox, this.parsedCsv[i]);
		} else {
			this.svg.replace(this.columnsHeaders[i], this.parsedCsv[i]);
		}
	}
}

Carte.prototype.showCartes = function () {
	for (i = 0; i < this.columnsHeaders.length; i++) {
		console.log(this.columnsHeaders[i] + " = " + this.parsedCsv[i]);
	}
}

Carte.prototype.addTextInBox = function (svgText, svgBox, text) {
	var lineSpacing = 1;
	svgText.move(svgBox.x, svgBox.y);
	boxWidth = svgBox.width;
	for (let character of text) {
		svgText.setText(svgText.text + character);
		svgText.update();
		if (svgText.width > boxWidth) {
			newSvgText = copy(svgText);
			newSvgText.y += svgText.height + lineSpacing;
			newSvgText.setText("");
			svgText = newSvgText;
		}
	}
}
