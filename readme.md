# Google Scripts
Some simple automations. A work in progress. Check out the [AdWords docs](https://developers.google.com/adwords/scripts/docs/your-first-script) and the [Apps Script docs](https://developers.google.com/apps-script/) for more information. 

## fb_logging.js / google_logging.js
Scripts that pull advertising data from Facebook and Google into Google Sheets. Rows get appended, rather than overwritten, which means that you can accumulate lots of data points to show trends. Your sheets can then be used as a data source for something like [Google Data Studio](https://datastudio.google.com/). 

## simple_stats.js
A script that returns lifetime statistics for a given AdWords campaign and enters those numbers into an existing Google spreadsheet. Stats include `impressions`, `clicks`, `cost per click`, `clickthrough rate`, and `cost`.  