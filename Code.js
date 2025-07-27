// Howard Lenos - Family Timeline - Code.js v 1.0

// Global variables 
var SPREADSHEET_ID = "1AlDyWzRB9eAXzwOwXr3g8rAqLKGgLv_5Tr0JCHtP2AQ";    // Family Timeline Data Spreadsheet ID
var SHEET_NAME = "Data";  // Sheet name for event data

/**
 * Serves the HTML file for the web app.
 * Ensure the HTML file is named 'Index.html' in your Apps Script project.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index.html')
    .evaluate()
    .setTitle('Family Timeline Information');
}

// Function to include html files in main page
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/**
 * Gets all data from the 'Data' sheet.
 * Assumes the first row contains headers.
 * @returns {Array<Object>} An array of objects, where each object represents a row.
 */
function getData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet with ID "${SPREADSHEET_ID}".`);
    }

    const range = sheet.getDataRange();
    const values = range.getValues();

    if (values.length === 0) {
      return []; // No data in the sheet
    }

    const headers = values[0]; // First row assumed to be headers
    const records = [];

    for (let i = 1; i < values.length; i++) { // Start from the second row for data
      const row = values[i];
      const record = {};
      headers.forEach((header, index) => {
        // Trim whitespace from header names and convert to camelCase for cleaner JS object keys
        const formattedHeader = header.trim().replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, str => str.toLowerCase());
        let cellValue = row[index];
        if (cellValue instanceof Date) {
          cellValue = cellValue.toISOString();
        }
        record[formattedHeader] = cellValue;
      });
      records.push(record);
    }
    return records;
  } catch (e) {
    // Log the error for debugging in Apps Script logs
    Logger.log("Error in getData: " + e.message);
    // Re-throw or return a user-friendly error message to the client
    throw new Error("Failed to retrieve data: " + e.message);
  }
}