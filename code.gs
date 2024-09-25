// Serve the HTML page
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to get the applications and their IDs from the Google Sheet
function getApplications() {
  const spreadsheetId = '1UE2fdxYGUGPFRoZtnQAbO8Tzc6T99GMAoiNhxGGwego'; 
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName('Applications');
  
  if (!sheet) {
    Logger.log("Sheet 'Applications' not found!");
    return [];
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data in sheet beyond headers.");// Serve the HTML page
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

// Function to send the CSV and data to the Generate Report Application
function sendCSVDataToReportApp(csvData, appName, team, date, month, year) {
  const reportAppUrl = "YOUR_GENERATE_REPORT_APP_DEPLOYED_URL"; // Add your Generate Report App's deployed URL
  
  const payload = {
    csvData: csvData,
    appName: appName,
    team: team,
    date: date,
    month: month,
    year: year
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(reportAppUrl, options);
    Logger.log("Response from Generate Report App: " + response.getContentText());
  } catch (error) {
    Logger.log("Error sending data to Generate Report App: " + error.toString());
  }
}

    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues(); // Assuming team is in 4th column
  
  let appList = [];
  data.forEach(row => {
    if (row[0] && row[1] && row[2] && row[3]) {
      appList.push({ name: row[0], appId: row[1], engagementId: row[2], team: row[3] });
    }
  });
  return appList;
}

// Function to construct the URL and download the CSV
function getDownloadLink(appID, engagementID) {
  const baseUrl = 'https://xyz.com/xyv/jdfyd/njd'; 
  const fullUrl = `${baseUrl}/${appID}/gdhgd/hjfhf/nhd/${engagementID}/hdhdb/ndhjd`; 
  return fullUrl;
}

// Function to fetch and send CSV to Generate Report application
function fetchAndSendCSV(appID, engagementID, appName, team) {
  const downloadUrl = getDownloadLink(appID, engagementID);
  const response = UrlFetchApp.fetch(downloadUrl);
  
  const csvData = response.getContentText(); // Get the CSV as text
  
  // Get the current date details
  const now = new Date();
  const date = now.getDate(); // Changed from day to date
  const month = now.getMonth() + 1; // JS months are 0-based
  const year = now.getFullYear();
  
  // Prepare data to send
  const postData = {
    csvData: csvData,
    appName: appName,
    team: team,
    date: date, // Changed from day to date
    month: month,
    year: year
  };
  
  // Send the data to the Generate Report Application via HTTP POST request
  const generateReportUrl = 'https://script.google.com/macros/s/YOUR_GENERATE_REPORT_APP_DEPLOYMENT_URL/exec'; // Replace with your deployment URL

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(postData)
  };

  const result = UrlFetchApp.fetch(generateReportUrl, options);
  Logger.log("Response from Generate Report Application: " + result.getContentText());
}
