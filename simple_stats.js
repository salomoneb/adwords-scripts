// Global vars
var date = new Date()
var currentDate = Utilities.formatDate(date, "ET", "yyyyMMdd")
var cellDate = Utilities.formatDate(date, "ET", "MM/dd/yyyy")    // Date to indicate when spreadsheet updated.
var campaignCondition = [    // If you want to get the stats for another campaign, add it as another element in the array. If you only have one campaign, the variable will accept a string.
  "Name='YOUR CAMPAIGN NAME'"
]
var campaignKey
var statArray = statArray || []    // Campaign stats pushed here.
var spreadsheetUrl = "ENTER YOUR SPREADSHEET URL HERE"

var sheetName = "ENTER YOUR SPREADSHEET NAME HERE"    // Ex. "Work Statistics"
var dateCell = "ENTER THE CELL WHERE YOU WANT TO INSERT YOUR DATE"    // Ex. "A3:A3"
var nameCell = "ENTER THE CELL WHERE YOU WANT TO INSERT THE CAMPAIGN NAME"    // Ex. "B3:B3"
var statsCells = "ENTER THE CELLS WHERE YOU WANT TO INSERT THE CAMPAIGN STATISTICS"  // Ex. "C3:F3" Note: the number of cells in the cell range must match the number of items that are being inserted. 

function SheetObj(url, sheet, date, name, stats) {    // Abstracts out spreadsheet manipulation. Allows us to more easily copy values to different spreadsheets.    
  this.ss = SpreadsheetApp.openByUrl(url)
  this.sheet = this.ss.getSheetByName(sheet)
  this.date = this.sheet.getRange(date)
  this.name = this.sheet.getRange(name)
  this.stats = this.sheet.getRange(stats)
}

function main() {    // Invoked main function.
  retrieveStats(statArray, copyStats)
}

function retrieveStats(array, sheetCallback) {    // Where we access the main campaign data. Takes the spreadsheet function as a callback.
  campaignCondition.forEach(function(item) {
    var campaignIterator = AdWordsApp.campaigns().withCondition(item).get()
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next()
      var campaignName = campaign.getName()
      var campaignStart = campaign.getStartDate()    // Gets the start date. Unlike the current date, this returns an object.
      campaignRange = campaign.getStatsFor(campaignStart, currentDate)    // Selects the full campaign date range.
      keySchema(campaignRange, array, campaignName)    // Where we call the function to get stats and push into array parameter.    
    }
  })
  sheetCallback(array)
}

function keySchema(dateRange, array, name) {    // Gets all of our statistics and pushes them into the array parameter.  
  var firstArray = firstArray || []
  var secondArray = secondArray || []
  firstArray.push(
    name,
    dateRange.getImpressions(),
    dateRange.getClicks(),
    dateRange.getAverageCpc(),
    dateRange.getCtr(),
    dateRange.getCost()
  )
  secondArray.push(firstArray)
  array.push(secondArray)    // The spreadsheet requires a set of two-dimensional arrays. This looks like "[ [[Element1]], [[Element2]], etc.]"
}

function copyStats(values) {    // 
  var mySheet =  new SheetObj(spreadsheetUrl, sheetName, dateCell, nameCell, statsCells)    // New instance of sheet object.
  
  values.forEach(function(value) {    // Copies stats to the different cells.
    mySheet.date.setValue(cellDate)
    mySheet.name.setValue(value[0].shift())
    mySheet.stats.setValues(value)
    
    mySheet.date = mySheet.date.offset(1,0)    // Moves control flow to the next row down. Need to come up with DRYer way of doing this. 
    mySheet.name = mySheet.name.offset(1,0) 
    mySheet.stats = mySheet.stats.offset(1,0) 
  })
}