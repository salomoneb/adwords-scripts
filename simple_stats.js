// Global vars
var date = new Date()
var currentDate = Utilities.formatDate(date, "ET", "yyyyMMdd")
var cellDate = Utilities.formatDate(date, "ET", "MM/dd/yyyy")
var campaignCondition = "Name='YOUR ADWORDS CAMPAIGN NAME HERE'"
var spreadsheetUrl = "YOUR SPREADSHEET URL HERE"
var sheetName = "YOUR SPREADSHEET NAME HERE"
var campaignKey
var statArray = []

// Invoked main functions
function main() {  
  getCampaignKey()
  getCampaignStats(campaignKey, statArray)
}

// Main campaign data access point
function getCampaignKey() {
 var campaignIterator = AdWordsApp.campaigns().withCondition(campaignCondition).get()
 
 while (campaignIterator.hasNext()) {
   var campaign = campaignIterator.next()
   var campaignStart = campaign.getStartDate()    // Gets the start date. Unlike the current date, this returns an object.
   campaignKey = campaign.getStatsFor(campaignStart, currentDate)    // Gets the full campaign date range.
   }
  return campaignKey
}

// Gets main campaign statistics
function getCampaignStats(key, array) {
  var intArray = []
  
  intArray.push(
    key.getImpressions(),
    key.getClicks(),
    key.getAverageCpc(),
    key.getCtr(),
    key.getCost()
    )
  
  var stringArray = intArray.map(String)    // Converts integers in array to strings.    
  array.push(stringArray)    // We do this because the spreadsheet requires a two-dimensional array.
  copyStats(array)    // Invokes function to copy stats to spreadsheet.
}

// Function that copies stats to spreadsheet
function copyStats(values) {
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl)
  var sheet = ss.getSheetByName(sheetName)
  var dateCell = sheet.getRange("DATE CELL (EX.A1): A1")    // Cell where you want the date to go.
  var rangeStats = sheet.getRange("STARTING CELL (EX.A1): ENDING CELL (EX.E1)")    // Cells where you want the statistics to go.
  
  dateCell.setValue(cellDate)
  rangeStats.setValues(values) 
}