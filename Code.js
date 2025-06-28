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
        record[formattedHeader] = row[index];
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
 * Adds a new record to the 'Data' sheet.
 * @param {Object} recordData - An object containing the new record's data.
 * Expected keys (camelCase) based on your HTML form:
 * eventID, eventType, eventDate, personID, location, description
 */
function addRow(recordData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet with ID "${SPREADSHEET_ID}".`);
    }

    // Get current headers to ensure correct column order for appending
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const newRow = [];

    // Map the incoming recordData to the sheet's header order
    headers.forEach(header => {
      const formattedHeader = header.trim().replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, str => str.toLowerCase());
      newRow.push(recordData[formattedHeader] !== undefined ? recordData[formattedHeader] : '');
    });

    sheet.appendRow(newRow);
  } catch (e) {
    Logger.log("Error in addRow: " + e.message);
    throw new Error("Failed to add record: " + e.message);
  }
}

/**
 * Updates an existing record in the 'Data' sheet based on EventID.
 * @param {Object} updatedRecord - An object containing the updated record data.
 * Must include the 'eventID' field to identify the record.
 */
function updateRow(updatedRecord) {
  // The exact header name in your Google Sheet that uniquely identifies a record.
  const ID_COLUMN_NAME_IN_SHEET = "Event ID";

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet with ID "${SPREADSHEET_ID}".`);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) { // Only headers or no data at all
      throw new Error("No records available to update.");
    }

    const headers = data[0];
    const idColumnIndex = headers.findIndex(h => h.trim() === ID_COLUMN_NAME_IN_SHEET);
    if (idColumnIndex === -1) {
      throw new Error(`ID column "${ID_COLUMN_NAME_IN_SHEET}" not found in sheet headers.`);
    }

    let rowIndexToUpdate = -1; // 0-indexed for array, will convert to 1-indexed for sheet
    for (let i = 1; i < data.length; i++) { // Start search from second row (data rows)
      // Use loose equality (==) for comparison as sheet values might be numbers/strings
      if (data[i][idColumnIndex] == updatedRecord.eventID) {
        rowIndexToUpdate = i;
        break;
      }
    }

    if (rowIndexToUpdate === -1) {
      throw new Error(`Record with EventID "${updatedRecord.eventID}" not found for update.`);
    }

    const rowToSet = [];
    headers.forEach((header, index) => {
      const formattedHeader = header.trim().replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '').replace(/^./, str => str.toLowerCase());
      // Use the updated value from updatedRecord, or the existing value if not provided
      rowToSet.push(updatedRecord[formattedHeader] !== undefined ? updatedRecord[formattedHeader] : data[rowIndexToUpdate][index]);
    });

    // Update the row in the sheet (rowIndexToUpdate + 1 because sheet rows are 1-indexed)
    sheet.getRange(rowIndexToUpdate + 1, 1, 1, rowToSet.length).setValues([rowToSet]);

  } catch (e) {
    Logger.log("Error in updateRow: " + e.message);
    throw new Error("Failed to update record: " + e.message);
  }
}

/**
 * Deletes a record from the 'Data' sheet based on EventID.
 * @param {string} eventId - The EventID of the record to delete.
 */
function deleteRow(eventId) {
  const ID_COLUMN_NAME_IN_SHEET = "Event ID";

  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" not found in spreadsheet with ID "${SPREADSHEET_ID}".`);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      throw new Error("No records available to delete.");
    }

    const headers = data[0];
    const idColumnIndex = headers.findIndex(h => h.trim() === ID_COLUMN_NAME_IN_SHEET);
    if (idColumnIndex === -1) {
      throw new Error(`ID column "${ID_COLUMN_NAME_IN_SHEET}" not found in sheet headers.`);
    }

    let rowIndexToDelete = -1; // 0-indexed for array, will convert to 1-indexed for sheet
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumnIndex] == eventId) { // Use loose equality (==) for comparison
        rowIndexToDelete = i;
        break;
      }
    }

    if (rowIndexToDelete === -1) {
      throw new Error(`Record with EventID "${eventId}" not found for deletion.`);
    }

    sheet.deleteRow(rowIndexToDelete + 1); // +1 because Apps Script rows are 1-indexed

  } catch (e) {
    Logger.log("Error in deleteRow: " + e.message);
    throw new Error("Failed to delete record: " + e.message);
  }
}