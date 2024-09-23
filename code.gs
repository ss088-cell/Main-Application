// Function to make API request with selected application ID
function callApiWithAppID(appID) {
  const apiUrl = 'https://your-api-endpoint.com/api'; // Replace with your actual API URL

  // Prepare request payload and options
  const options = {
    'method': 'post', // Assuming it's a POST request
    'contentType': 'application/json',
    'payload': JSON.stringify({
      'applicationId': appID // Pass the appID in the payload
    })
  };
  
  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());
    
    Logger.log("API Response: " + JSON.stringify(result)); // Log the response for debugging
    return result; // Return the response back to the frontend
  } catch (error) {
    Logger.log("Error calling API: " + error.message);
    return { 'error': 'Failed to call API. ' + error.message };
  }
}

// Function to get the applications and their IDs from the Google Sheet
function getApplications() {
  const spreadsheetId = '1UE2fdxYGUGPFRoZtnQAbO8Tzc6T99GMAoiNhxGGwego'; // Replace with your actual spreadsheet ID
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName('Applications');
  
  let availableSheets = spreadsheet.getSheets().map(s => s.getName());
  Logger.log("Available Sheets: " + availableSheets);

  if (!sheet) {
    Logger.log("Sheet 'Applications' not found!");
    return [];
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data in sheet beyond headers.");
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  
  Logger.log("Fetched data: " + JSON.stringify(data));
  
  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1]) {
      appList.push({ name: row[0], id: row[1] });
    }
  });
  return appList;
}

// Function to serve the HTML
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Generate Application Report');
}
