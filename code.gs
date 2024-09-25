// Function to serve the HTML page
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to get the applications and their IDs from the Google Sheet
function getApplications() {
  const spreadsheetId = '1UE2fdxYGUGPFRoZtnQAbO8Tzc6T99GMAoiNhxGGwego'; // Replace with your actual spreadsheet ID
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName('Applications');
  
  if (!sheet) {
    Logger.log("Sheet 'Applications' not found!");
    return [];
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data in sheet beyond headers.");
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  
  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1] && row[2]) {
      appList.push({ name: row[0], appId: row[1], engagementId: row[2] });
    }
  });
  return appList;
}

// Function to construct the URL with appID and engagementID and return it
function getDownloadLink(appID, engagementID) {
  const baseUrl = 'https://xyz.com/xyv/jdfyd/njd'; // Static part of the URL
  const fullUrl = `${baseUrl}/${appID}/gdhgd/hjfhf/nhd/${engagementID}/hdhdb/ndhjd`; 
  return fullUrl;
}

// Function to upload the CSV from a URL and write it to a Google Sheet
function importCSVFromUrl(url) {
  const response = UrlFetchApp.fetch(url); // Fetch the CSV file
  const csv = response.getContentText(); // Get the content as text
  const data = Utilities.parseCsv(csv); // Parse the CSV text

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Clear the current content
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data); // Set the data into the sheet
}

// Updated function to handle CSV upload from URL
function uploadCSVToSheet(url) {
  try {
    importCSVFromUrl(url);
    return 'CSV file successfully uploaded and processed!';
  } catch (e) {
    return `Error uploading CSV: ${e.message}`;
  }
}
