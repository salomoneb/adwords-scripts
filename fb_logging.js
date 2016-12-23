// Facebook access variables 
var token = "XXXX" // Enter your Facebook access token here. 
var url = "https://graph.facebook.com/v2.8/act_10155507023415075" // Endpoint variable. 
+ "?fields=campaigns%7Bname%2C%20status%2Cinsights.fields(date_start%2Cdate_stop%2Cclicks%2Cimpressions%2Cctr%2Ccpc%2Cspend).date_preset(this_quarter)%7D&access_token="
+ token

// Reorganized raw Facebook data here.
var dataObj = dataObj || []

// Stores formatted data for spreadsheet.
var headers = headers || []
var rows = rows || []

// Google spreadsheet data.
var activeSheet = SpreadsheetApp.getActiveSpreadsheet()
var fbSheet = activeSheet.getSheetByName("XXXX") // Enter your spreadsheet's name. 

// Runs everything.
function mainFunc() {
  updateSheet()
}

// Get Facebook data
function callDataSource() {
 var response = UrlFetchApp.fetch(url)
 var parsedResponse = JSON.parse(response.getContentText())
 var dataKey = parsedResponse.campaigns.data
 
 return dataKey
}
 
// Reformat Facebook data for easier manipulation
function reformatData(rawData) {
 for (var i = 0; i < rawData.length; i++) {
   
   // Sets the date to be yesterday so reports match data.
   var date = new Date()
   date.setDate(date.getDate() - 1)
   
   // Main data object.
   var data = {
     date: date,
     name: rawData[i].name,
     status: rawData[i].status
   }
   
   // If insights exist, push them into object.
   if (rawData[i].insights) {
     var insightsKey = rawData[i].insights.data
     for (var j = 0; j < insightsKey.length; j++) {
       data.clicks = insightsKey[j].clicks
       data.impressions = insightsKey[j].impressions
       data.ctr = insightsKey[j].ctr
       data.cpc = insightsKey[j].cpc
       data.spend = insightsKey[j].spend
     }
   }
   dataObj.push(data)
 }
}

// Takes data from flattened object and puts it into arrays. 
function prepData() {
  reformatData(callDataSource())
  var headerValues = headerValues || []
  
  // Gets headers from the reformatted Facebook data.
  for (var i = 0; i < dataObj.length; i++) {
    var rowValues = rowValues || []
    
    // For each object element in the dataObj array, get the key and value.
    for (var value in dataObj[i]) {
      // If the header value doesn't exist in the array, push it.
      if (headerValues.indexOf(value) === -1) {
        headerValues.push(value)
      }
      rowValues.push(dataObj[i][value])
    }
    rows.push(rowValues)
    rowValues = []
  }
  headers.push(headerValues)
  
  checkHeaders()
}

function checkHeaders() {
  var headerRow = fbSheet.getRange(1,1,1, fbSheet.getMaxColumns())
  var headerCells = headerRow.getDisplayValues()
  
  // Checks whether the existing headers contain blank values. This often happens when a new sheet is created.
  var headerCellCheck = headerCellCheck || []
  headerCells[0].forEach(function(cell) {
    if (cell !== "") {
      headerCellCheck.push(cell)
    }
  })
  
  // If new headers don't equal old ones and new headers contain values not on the sheet, update the headers.
  if (headers[0] !== headerCellCheck && headers[0].length > headerCellCheck.length) {
    var headerRange = fbSheet.getRange(1,1,1, headers[0].length)
    headerRange.setValues(headers)
  }
}

// Checks whether the sheet is empty. 
function checkBlanks() {
  var mainValues = fbSheet.getSheetValues(2, 1, fbSheet.getMaxRows(), fbSheet.getMaxColumns())
  for (var i = 0; i < mainValues.length; i++) {
    var row = mainValues[i]
    for (var j = 0; j < row.length; j++) {
      if (row[j] !== "") {
        Logger.log("First value in sheet: " + row[j])
        return false
      }
      else {
        Logger.log("No values in sheet")
        return true
      }
    }                                         
  }
}

// If sheet's empty, delete all the rows. Otherwise, just add. 
function updateSheet() {
  prepData()
  if (checkBlanks() === true)  {
    fbSheet.deleteRows(2, fbSheet.getMaxRows()-1)
  }
  for (var i = 0; i < rows.length; i++) {
    fbSheet.appendRow(rows[i])
  }
}

