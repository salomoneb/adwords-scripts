var ss = SpreadsheetApp.openByUrl("XXXX") // Your spreadsheet URL here
var googleSheet = ss.getSheetByName("XXXX") // Your spreadsheet name here.
var headers
var values

// Does everything.
function main() {
  addData()
}

// Retrieves header and main sheet values, and pushes header values into sheet.
function getStats() {
  values = []
  headers = []
  
  // My script will pull in yesterday's stats and I want to log the date that corresponds to the figures. 
  var date = new Date(
  date.setDate(date.getDate() - 1)
  
  // AdWords only allows you to filter by label ID, not name. See https://developers.google.com/adwords/api/docs/guides/labels
  // This tells my script to target campaigns with this label. You can remove or modify this. 
  var label = AdWordsApp.labels()
    .withCondition("Name = '2016 Advertising'") 
    .get().next()
  
  var report = AdWordsApp.report("SELECT CampaignName, CampaignStatus, Clicks, Impressions, Ctr, AverageCpc, Cost " +
       "FROM CAMPAIGN_PERFORMANCE_REPORT WHERE Labels CONTAINS_ANY " +
    "[" + label.getId() + "] DURING 20160410, 20161222")
  var rows = report.rows()
  while (rows.hasNext()) {
    var row = rows.next()
    values.push([
      date,
      row["CampaignName"],
      row["CampaignStatus"],
      row["Clicks"],
      row["Impressions"],
      row["Ctr"],
      row["AverageCpc"],
      row["Cost"]
    ])
  }
  
  headers.push([
    "Date",
    report.getColumnHeader("CampaignName").getBulkUploadColumnName(),
    report.getColumnHeader("CampaignStatus").getReportColumnName(),
    report.getColumnHeader("Clicks").getBulkUploadColumnName(),
    report.getColumnHeader("Impressions").getBulkUploadColumnName(),
    report.getColumnHeader("Ctr").getBulkUploadColumnName(),
    report.getColumnHeader("AverageCpc").getBulkUploadColumnName(),
    report.getColumnHeader("Cost").getBulkUploadColumnName()
  ])
  
  // Function to push headers into sheet. 
  checkHeaders()
  return values
}

function addData() {
  var statsArray = getStats()
  var headerRow = googleSheet.getRange(1,1,1, googleSheet.getMaxColumns())
  var headerCells = headerRow.getDisplayValues()
  
  if (checkBlanks() === true)  {
    googleSheet.deleteRows(2, googleSheet.getMaxRows()-1)
  }
  
  // Adds all of the row data to the sheet
  statsArray.forEach(function(item) {
    googleSheet.appendRow(item)
  })
}

function checkHeaders() {
  var headerRow = googleSheet.getRange(1,1,1, googleSheet.getMaxColumns())
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
    var headerRange = googleSheet.getRange(1,1,1, headers[0].length)
    headerRange.setValues(headers)
  }
}

// Checks for blank non-header values.
function checkBlanks() {
  var mainValues = googleSheet.getSheetValues(2, 1, googleSheet.getMaxRows(), googleSheet.getMaxColumns())
  for (var i = 0; i < mainValues.length; i++) {
    var row = mainValues[i]
    for (var j = 0; j < row.length; j++) {
      if (row[j] !== "") {
        Logger.log("First value in sheet: " + row[j])
        return false
      }
      else {
        Logger.log("No values in sheet.")
        return true
      }
    }                                         
  }
}