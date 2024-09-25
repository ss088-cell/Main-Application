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

// Function to import CSV from a URL and create a new Google Sheet
function importCSVFromUrl(url) {
  try {
    const response = UrlFetchApp.fetch(url); // Fetch the CSV file
    const csv = response.getContentText(); // Get the content as text
    Logger.log("Fetched CSV content: " + csv); // Log the fetched content for debugging

    const data = Utilities.parseCsv(csv); // Parse the CSV text

    // Create a new spreadsheet
    const newSpreadsheet = SpreadsheetApp.create('Imported CSV Data');
    const sheet = newSpreadsheet.getActiveSheet();
    
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data); // Set the data into the sheet
    
    // Return success message with the download link
    return `CSV imported successfully! You can download it <a href="${newSpreadsheet.getUrl()}" target="_blank">here</a>.`; 
  } catch (error) {
    Logger.log("Error importing CSV: " + error.message); // Log the error message
    return "Error importing CSV: " + error.message; // Return error message
  }
}

// Function to generate and return a download link for the CSV
function generateCSV(appID, engagementID) {
  // Here, implement your logic to generate CSV data based on appID and engagementID
  const csvData = "Header1,Header2,Header3\nValue1,Value2,Value3"; // Example CSV data, replace with your logic

  const file = DriveApp.createFile('GeneratedReport.csv', csvData, MimeType.CSV);
  const url = file.getDownloadUrl();

  return url; // Return the download link for the generated CSV
}
