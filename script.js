function getTextFromUrl(Url) {
  var req = new XMLHttpRequest();
  req.open('GET', Url, false);
  req.send(null);
  if (req.status == 200) {
    return req.responseText;
  }
}

var csvText = getTextFromUrl('https://framacalc.org/test-minipen.csv');
console.log(csvText);



function parse_csv(leCSV) {

  // CONSTANTS
  var separationChar = ",";
  var endOfLineChar = "\n";
  var quotationMarks = "\"";

  // INITIALIZATION
  var entries = [];
  var entry = [];
  var filteredEntries = [];
  var textField = "";
  var depth = 0 ;

  // CONTROL OF ALL CHARS OF THE DATABASE TEXT TO SEPARATE THE FIELDS (;)
  console.log("[order_csv] Verifying chars to separate the fields into " + leCSV);
  for (var i = 0; i < leCSV.length; i++) {

    var lettre = leCSV.charAt(i);
    

    // Separation
    if (lettre == separationChar && depth==0) {
      entry.push(textField);
      textField = "";
      console.log(i+' '+lettre+' séparation');
    } else {
      // End of the line
      if (lettre == endOfLineChar) {
        entry.push(textField);
        entries.push(entry);
        textField = "";
        entry = [];
        console.log(i+' '+lettre+' fin de ligne');
      } else {
        //Quotation marks
        if (lettre == quotationMarks) {
		  if (depth == 0){
		  depth++;
		 }else{
		  depth--;
		 }
          textField += "'";
          console.log(i+' '+lettre+' guillemets');
        } else {
          // Normal lettre
          textField += lettre;
          console.log(i+' '+lettre);
        }
      }
    }

}

/*
    // DELETION OF THE HEADERS AND TITLES (FIRST COLUMN IS NAN)
    print "[parse_csv] Removing the headers and titles into ordered " + leCSV
    for entry in entries:

      // Good entry : generate
      try:
      test = int(entry[0])
    filteredEntries.push(entry);

    // Title : ignore
    except ValueError:
      pass


    // RETURNS THE ORGANIZED AND FILTERED ENTRIES
    return filteredEntries
      */
	console.log(entries);
  return entries ;
  }
  
var untext = parse_csv(csvText) ;