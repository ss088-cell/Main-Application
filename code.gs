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
  
  // Assuming column 1 has application names, column 2 has application IDs, column 3 has engagement IDs, column 4 has team names
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  
  Logger.log("Fetched data: " + JSON.stringify(data));
  
  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1] && row[2] && row[3]) {
      appList.push({ name: row[0], appId: row[1], engagementId: row[2], teamName: row[3] });
    }
  });
  return appList;
}

// Function to construct the URL with appID and engagementID and return it
function getDownloadLink(appID, engagementID) {
  const baseUrl = 'https://xyz.com/xyv/jdfyd/njd/appID/gdhgd/hjfhf/nhd/EngagementID/hdhdb/ndhjd';
  const fullUrl = `${baseUrl.replace('appID', appID).replace('EngagementID', engagementID)}`; 
  Logger.log("Generated URL: " + fullUrl);
  return fullUrl;
}

// Function to call the Generate Report Application
function passCSVToGenerateReport(appId, engagementId) {
  const url = getDownloadLink(appId, engagementId);
  
  try {
    const csvData = UrlFetchApp.fetch(url).getContentText(); // Fetching CSV data

    // Find application name and team name using appId and engagementId
    const appList = getApplications();
    const appDetails = appList.find(app => app.appId === appId && app.engagementId === engagementId);
    
    if (!appDetails) {
      Logger.log("Application details not found!");
      return;
    }

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const year = currentDate.getFullYear();
    
    const teamName = appDetails.teamName; // Get team name from fetched data
    const appName = appDetails.name; // Get application name from fetched data

    // Call uploadCSV function in the Generate Report Application
    const generateReportUrl = 'YOUR_GENERATE_REPORT_DEPLOYMENT_URL'; // Replace with actual deployment URL
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ csvData, teamName, appName, day, month, year })
    };

    // Make an HTTP POST request to the Generate Report Application
    const response = UrlFetchApp.fetch(generateReportUrl, options);
    Logger.log("Response from Generate Report Application: " + response.getContentText());
  } catch (error) {
    Logger.log("Error fetching CSV data: " + error);
  }
}

// Example function to initiate the process
function generateReportForApplication(appId, engagementId) {
  passCSVToGenerateReport(appId, engagementId);
}
