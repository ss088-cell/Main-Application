// Serve the HTML page
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to get the applications, IDs, and team name from the Google Sheet
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

  // Get all data starting from row 2 (to skip the headers)
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues(); // 4 columns: Application Name, App ID, Engagement ID, Team Name

  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1] && row[2] && row[3]) {
      appList.push({
        name: row[0],        // Application Name
        appId: row[1],       // App ID
        engagementId: row[2],// Engagement ID
        team: row[3]         // Team Name (Column D)
      });
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
  const downloadLink = getDownloadLink(appID, engagementID); // Get the download link using the provided IDs

  // Example logic for generating CSV data based on appID and engagementID
  const csvData = "Header1,Header2,Header3\nValue1,Value2,Value3"; // Example CSV data, replace with your logic

  const file = DriveApp.createFile('GeneratedReport.csv', csvData, MimeType.CSV);
  const url = file.getDownloadUrl(); // This generates the download URL

  return downloadLink; // Return the constructed download link
}
