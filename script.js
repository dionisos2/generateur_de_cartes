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
  var columnHeaders = [];
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

	  
  return entries ;
  }
  
// EXTRACTING COLUMNS HEADERS
 function filterHeaders(tableau){
 console.log("[order_csv] Extracting columns headers ");
 var lesHeaders = tableau.splice(0, 1);
 return lesHeaders[0]
 }
 
 // EXTRACTING ENTRIES
 function filterEntries(tableau){
 console.log("[order_csv] Extracting entries ");
 var lesEntries = tableau.splice(1, tableau.length - 1);
 return lesEntries ;
 }
  
var leTableau = parse_csv(csvText) ;
columnHeaders = filterHeaders(leTableau) ;
filteredEntries = filterEntries(leTableau) ;
console.log(columnHeaders);
console.log(filteredEntries);




