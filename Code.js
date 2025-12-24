// Howard Lenos - Family Timeline - Code.js v 2.0

// Global variables 
var SPREADSHEET_ID = "1AlDyWzRB9eAXzwOwXr3g8rAqLKGgLv_5Tr0JCHtP2AQ";    // Family Timeline Data Spreadsheet ID
var SHEET_NAME_EVENTS = "Data";  // Sheet name for event data
var SHEET_NAME_PEOPLE = "People"; // Sheet name for people data

/**
 * Serves the HTML file for the web app or JSON data.
 */
function doGet(e) {
  // If 'format=json' is passed, return Data as JSON
  if (e.parameter.format === 'json') {
    const data = {
      events: getSheetData(SHEET_NAME_EVENTS),
      people: getSheetData(SHEET_NAME_PEOPLE)
    };
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Otherwise serve the HTML app
  switch (e.parameter.file) {
    case 'manifest.html':
      return ContentService.createTextOutput(
        HtmlService.createHtmlOutputFromFile('manifest.html').getContent()
      ).setMimeType(ContentService.MimeType.JSON);
    case 'service-worker.html':
      return ContentService.createTextOutput(
        HtmlService.createHtmlOutputFromFile('manifest.html').getContent()
      ).setMimeType(ContentService.MimeType.JAVASCRIPT);
    default:
      return HtmlService.createTemplateFromFile('Index.html')
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
        .setTitle('Family Timeline Information');
  }
}

/**
 * Handles POST requests to add data.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.payload;

    let result = {};

    if (action === 'addPerson') {
      result = addRecord(SHEET_NAME_PEOPLE, payload);
    } else if (action === 'addEvent') {
      result = addRecord(SHEET_NAME_EVENTS, payload);
    } else {
      throw new Error('Invalid action');
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to include html files in main page
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Generic function to get all data from a sheet.
 */
function getSheetData(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) return [];

    const range = sheet.getDataRange();
    const values = range.getValues();

    if (values.length === 0) return [];

    const headers = values[0];
    const records = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const record = {};
      headers.forEach((header, index) => {
        // camelCase the header
        const key = header.trim().replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, str => str.toLowerCase());
        let cellValue = row[index];
        if (cellValue instanceof Date) {
          cellValue = cellValue.toISOString().split('T')[0]; // Store as YYYY-MM-DD
        }
        record[key] = cellValue;
      });
      records.push(record);
    }
    return records;
  } catch (e) {
    Logger.log("Error in getSheetData: " + e.message);
    return [];
  }
}

/**
 * Adds a new record to a sheet.
 */
function addRecord(sheetName, record) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(sheetName);

  // Create sheet if it doesn't exist (basic setup)
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    // You might want to define default headers here if creating new
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => {
    // Basic mapping: match header name to record key (case insensitive logic could be added)
    const key = header.trim().replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, str => str.toLowerCase());
    return record[key] || '';
  });

  sheet.appendRow(newRow);
  return record;
}