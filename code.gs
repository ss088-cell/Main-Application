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

  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues(); // Updated to get 4 columns (including Team)

  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1] && row[2] && row[3]) {
      appList.push({ name: row[0], appId: row[1], engagementId: row[2], team: row[3] });
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

// Function to generate and return a download link for the CSV
function generateCSV(appID, engagementID) {
  // Example logic for generating CSV data based on appID and engagementID
  const csvData = "Header1,Header2,Header3\nValue1,Value2,Value3"; // Example CSV data, replace with your logic

  const file = DriveApp.createFile('GeneratedReport.csv', csvData, MimeType.CSV);
  const url = file.getDownloadUrl(); // This generates the download URL

  return url; // Return the download link for the generated CSV
}
