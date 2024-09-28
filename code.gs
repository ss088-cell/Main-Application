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

// Function to upload and process the CSV file
function uploadFiles(csvData, team, appName, date, month, year) {
  // Create a new Google Sheet
  const sheetName = `Macroscope Scan ${team} ${appName} - ${date}-${month}-${year}`;
  const spreadsheet = SpreadsheetApp.create(sheetName);
  const sheet = spreadsheet.getActiveSheet();

  // Split CSV data into rows and columns
  const rows = Utilities.parseCsv(csvData);

  // Write the CSV data into the sheet
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

  // Return the URL of the created Google Sheet
  return spreadsheet.getUrl();
}

// Function to visualize data from the spreadsheet
function visualizeData(spreadsheetUrl) {
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  const sheet = spreadsheet.getActiveSheet();
  const data = sheet.getRange("A1:I1000").getValues(); // Adjust range to cover all 9 columns

  let htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f4f4f4;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 8px 12px;
          border: 1px solid #ddd;
        }
        th {
          background-color: #4CAF50;
          color: white;
        }
      </style>
    </head>
    <body>
      <h1>Report Data</h1>
      <table>
        <tr>
          <th>Description</th>
          <th>File Path</th>
          <th>ID</th>
          <th>Line</th>
          <th>Mitigation</th>
          <th>References</th>
          <th>Severity</th>
          <th>Title</th>
          <th>Found By</th>
        </tr>
  `;

  // Loop through each row and add to the HTML content
  data.forEach(row => {
    htmlContent += `
      <tr>
        <td>${row[0] || ''}</td>
        <td>${row[1] || ''}</td>
        <td>${row[2] || ''}</td>
        <td>${row[3] || ''}</td>
        <td>${row[4] || ''}</td>
        <td>${row[5] || ''}</td>
        <td>${row[6] || ''}</td>
        <td>${row[7] || ''}</td>
        <td>${row[8] || ''}</td>
      </tr>
    `;
  });

  htmlContent += `
      </table>
    </body>
    </html>
  `;

  return htmlContent;
}
