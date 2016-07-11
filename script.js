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



function parse_csv(csvText) {

  // CONSTANTS
  var separationChar = ",";
  var endOfLineChar = "\n";
  var quotationMarks = "\"";

  // INITIALIZATION
  var entries = [];
  var entry = [];
  var filteredEntries = [];
  var textField = "";

  // CONTROL OF ALL CHARS OF THE DATABASE TEXT TO SEPARATE THE FIELDS (;)
  console.log("[order_csv] Verifying chars to separate the fields into " + csvText);
  for (var i = 0; i < csvText.length; i++) {

    var char = csvText.charAt(i);
    

    // Separation
    if (char == separationChar) {
      entry.push(textField);
      textField = "";
      console.log(i+' '+char+' séparation');
    } else {
      // End of the line
      if (char == endOfLineChar) {
        entry.push(textField);
        entries.push(entry);
        textField = "";
        entry = [];
        console.log(i+' '+char+' fin de ligne');
      } else {
        //Quotation marks
        if (char == quotationMarks) {
          textField += "'";
          console.log(i+' '+char+' guillemets');
        } else {
          // Normal char
          textField += char;
          console.log(i+' '+char);
        }
      }
    }

}

/*
    // DELETION OF THE HEADERS AND TITLES (FIRST COLUMN IS NAN)
    print "[order_csv] Removing the headers and titles into ordered " + csvText
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
  return textField ;
  }
  
var untext = parse_csv(csvText) ;