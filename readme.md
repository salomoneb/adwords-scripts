# Google Scripts
Some simple automations. A work in progress. Check out the [Google docs](https://developers.google.com/adwords/scripts/docs/your-first-script) for more info.

## simple_stats.js
A script that returns lifetime statistics for a given AdWords campaign and enters those numbers into an existing Google spreadsheet. Stats include `impressions`, `clicks`, `cost per click`, `click through rate`, and `cost`.  

#### Getting Started
You'll want to have a [Google Sheet](https://docs.google.com/spreadsheets/) created before you use this.

1. Log into your AdWords account.
2. Navigate to a campaign.
3. Select `bulk operations` ->  `scripts`.
4. Create a new script.
5. Paste `simple_stats.js` into it.
6. Replace the fields indicated in the script with your own information. Be careful not to remove the script's quotation marks. 