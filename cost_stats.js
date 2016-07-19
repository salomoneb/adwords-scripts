// Global vars
var date = new Date()
var currentDate = Utilities.formatDate(date, "EST", "yyyyMMdd")
var cellDate = Utilities.formatDate(date, "EST", "MM/dd/yyyy")
var campaignCondition = "Name='YOUR ADWORDS CAMPAIGN NAME HERE'"
var spreadsheetUrl = "YOUR SPREADSHEET URL HERE"
var sheetName = "YOUR SPREADSHEET URL HERE"
var campaignKey
var statArray = []

// Copies everything to the spreadsheet
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
   campaignKey = campaign.getStatsFor(campaignStart, currentDate) // Gets the full campaign date range.
   }
  return campaignKey
}

// Gets main campaign statistics
function getCampaignStats(key, array) {
  var stringArray = []
  
  // AdWords horribly doesn't seem to let you convert array elements to string using a loop.
  stringArray.push(
    key.getImpressions().toString(),
    key.getClicks().toString(),
    key.getAverageCpc().toString(),
    key.getCtr().toString(),
    key.getCost().toString()
    )

  // Needs to be a two dimensional array for spreadsheet. 
  array.push(stringArray)
  copyStats(array)
}

function copyStats(values) {
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl)
  var sheet = ss.getSheetByName(sheetName)

  var dateCell = sheet.getRange("DATE CELL (EX.A1): A1")
  var rangeStats = sheet.getRange("STARTING CELL (EX.A1): ENDING CELL (EX.E1)")
  
  dateCell.setValue(cellDate)
  rangeStats.setValues(values) 
}