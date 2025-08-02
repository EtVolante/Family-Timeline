// Howard Lenos - Family Timeline - Code.js v 1.0

// Global variables 
var SPREADSHEET_ID = "1AlDyWzRB9eAXzwOwXr3g8rAqLKGgLv_5Tr0JCHtP2AQ";    // Family Timeline Data Spreadsheet ID
var SHEET_NAME = "Data";  // Sheet name for event data

/**
 * Serves the HTML file for the web app.
 * Ensure the HTML file is named 'Index.html' in your Apps Script project.
 */
function doGet(e) {
  switch (e.parameter.file) {
    case 'service-worker.html':
      return ContentService.createTextOutput(
        HtmlService.createHtmlOutputFromFile('service-worker.html').getContent()
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    case 'manifest.html':
      return ContentService.createTextOutput(
        HtmlService.createHtmlOutputFromFile('manifest.html').getContent()
      ).setMimeType(ContentService.MimeType.JSON);
    default:
      return HtmlService.createTemplateFromFile('Index.html')
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
        .setTitle('Family Timeline Information');
  }
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

/**
 * Gets level labels from the 'level_labels' named range.
 * @returns {Array<Object>} An array of objects with level and label properties.
 */
function getLevelLabels() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const range = spreadsheet.getRangeByName('level_labels');
    if (!range) {
      throw new Error('Named range "level_labels" not found in spreadsheet.');
    }

    const values = range.getValues();
    if (values.length === 0) {
      return []; // No data in the range
    }

    const labels = [];
    for (let i = 1; i < values.length; i++) { // Start from second row (skip header)
      const row = values[i];
      if (row[0] && row[1]) { // Both level and label should exist
        labels.push({
          level: row[0],
          label: row[1]
        });
      }
    }
    return labels;
  } catch (e) {
    Logger.log("Error in getLevelLabels: " + e.message);
    throw new Error("Failed to retrieve level labels: " + e.message);
  }
}