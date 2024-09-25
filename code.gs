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
  
  // Assuming column 1 has application names, column 2 has application IDs, column 3 has engagement IDs
  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  
  Logger.log("Fetched data: " + JSON.stringify(data));
  
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
  
  // Construct the full URL with appID and engagementID
  const fullUrl = `${baseUrl}/${appID}/gdhgd/hjfhf/nhd/${engagementID}/hdhdb/ndhjd`; 
  Logger.log("Generated URL: " + fullUrl);
  
  return fullUrl;
}

// Function to upload the CSV to a Google Sheet
function uploadCSVToSheet(csvUrl) {
  try {
    // Fetch the CSV data from the URL
    const response = UrlFetchApp.fetch(csvUrl);
    const responseCode = response.getResponseCode();
    const csvData = response.getContentText();
    
    Logger.log("Response code: " + responseCode); // Check the response code
    Logger.log("CSV data: " + csvData);           // Check the fetched CSV content

    if (responseCode !== 200) {
      throw new Error('Failed to fetch CSV. Response code: ' + responseCode);
    }

    // Parse the CSV data
    const parsedData = Utilities.parseCsv(csvData);
    
    // Create a new Google Sheet
    const newSheet = SpreadsheetApp.create('Uploaded CSV Data');
    const sheet = newSheet.getActiveSheet();
    
    // Insert the parsed CSV data into the new sheet
    sheet.getRange(1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
    
    // Get the URL of the new Google Sheet
    const sheetUrl = newSheet.getUrl();
    
    Logger.log("Created new sheet: " + sheetUrl);
    
    return sheetUrl;  // Return the Google Sheet URL
  } catch (error) {
    Logger.log('Error uploading CSV: ' + error.toString()); // Log the exact error
    return 'Error uploading CSV!';
  }
}
