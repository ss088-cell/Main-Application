function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to get the applications and their IDs from the Google Sheet
function getApplications() {
  const spreadsheetId = '1UE2fdxYGUGPFRoZtnQAbO8Tzc6T99GMAoiNhxGGwego'; // Replace with your actual spreadsheet ID
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Applications');
  
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

// Function to generate download link and pass CSV to Generate Report Application
function generateReport(appId, engagementId) {
  const baseUrl = `https://xyz.com/xyv/jdfyd/njd/${appId}/gdhgd/hjfhf/nhd/${engagementId}/hdhdb/ndhjd`; // Replace with actual URL
  const csvData = UrlFetchApp.fetch(baseUrl).getContentText(); // Fetch CSV data from the generated link
  
  // Get current date details
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based
  const year = date.getFullYear();

  // Assuming the team name is retrieved from the sheet
  const teamName = 'Your Team Name'; // You can implement logic to fetch the actual team name
  const appName = 'Your Application Name'; // You can implement logic to fetch the actual application name

  // Prepare data to send to Generate Report Application
  const reportData = {
    csvData: csvData,
    appName: appName,
    team: teamName,
    day: day,
    month: month,
    year: year
  };

  // Set the URL of the Generate Report Application
  const generateReportUrl = 'https://script.google.com/macros/s/YOUR_GENERATE_REPORT_APP_DEPLOYMENT_ID/exec'; // Replace with your actual Generate Report app deployment URL

  // Call the Generate Report application
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(reportData),
  };

  try {
    const response = UrlFetchApp.fetch(generateReportUrl, options);
    Logger.log(response.getContentText()); // Log the response for debugging
  } catch (error) {
    Logger.log("Error in fetching report: " + error.message);
  }
}
