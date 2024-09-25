// Serve the HTML page
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

// Function to import CSV from a URL and write to Google Sheet
function importCSVFromUrl(url) {
  try {
    // Fetch the CSV file from the provided URL
    const response = UrlFetchApp.fetch(url);
    
    // Get the content of the CSV file as text
    const csv = response.getContentText();
    
    // Parse the CSV content into a 2D array
    const data = Utilities.parseCsv(csv);
    
    // Get the active Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Clear any existing content in the sheet
    sheet.clear();
    
    // Set the parsed CSV data into the sheet
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // Log the success message
    Logger.log('CSV data imported successfully');
    
    // Get the spreadsheet ID to generate the link
    const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    
    // Open the Google Sheet in a new tab
    const htmlOutput = HtmlService.createHtmlOutput(`<script>window.open("${sheetUrl}");</script>`)
                                  .setWidth(100)
                                  .setHeight(50);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Opening Google Sheet');
    
  } catch (error) {
    Logger.log(`Error importing CSV: ${error}`);
    SpreadsheetApp.getUi().alert('Failed to import CSV. Please check the URL and try again.');
  }
}
