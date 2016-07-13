function main() {
  
  // Global vars
  var date = new Date()
  var currentDate = Utilities.formatDate(date, "EST", "yyyyMMdd")
  var cellDate = Utilities.formatDate(date, "EST", "MM/dd/yyyy")
  var campaignCondition = "Name='PASTE YOUR CAMPAIGN NAME HERE'"    // Modify with your info.
  
  var spreadsheetUrl = "PASTE YOUR SPREADSHEET URL LINK HERE"   // Modify with your info.
  var sheetName = "PASTE THE SPREADSHEET TAB NAME HERE"   // Modify with your info.
  
  // Invoked function to copy everything to the spreadsheet.
  copyData()
  
  // Gets campaign cost data 
  function getData() {
    var campaignIterator = AdWordsApp.campaigns().withCondition(campaignCondition).get()
    
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next()
      var campaignStart = campaign.getStartDate()    // Unlike the current date, this returns an object.
      var costRange = campaign.getStatsFor(campaignStart, currentDate)
      var cost = costRange.getCost()
    }
    return cost
  }
  
  function copyData() {
    var ss = SpreadsheetApp.openByUrl(spreadsheetUrl)
    var sheet = ss.getSheetByName(sheetName)
    
    // Selects spreadsheet cells
    var dateCell = sheet.getRange("PASTE CELL1 HERE (EX. A2) : PASTE CELL1 HERE")   // Modify with your info.
    var costCell = sheet.getRange("PASTE CELL2 HERE (EX. B4) : PASTE CELL2 HERE")   // Modify with your info.
    
    // Sets cell values
    dateCell.setValue(cellDate)
    costCell.setValue(getData())    // References data returned in getData function.
  } 
}