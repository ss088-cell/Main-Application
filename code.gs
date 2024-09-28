function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function getApplications() {
  // Replace with your logic to get applications
  return [
    { appId: 1, engagementId: 101, name: 'App One', team: 'Team A' },
    { appId: 2, engagementId: 102, name: 'App Two', team: 'Team B' }
  ];
}

function generateCSV(appId, engagementId) {
  // Replace with your logic to generate a CSV file
  // Example: Return a URL to download the generated CSV
  return "https://example.com/download/report.csv";
}

function uploadFiles(csvData, teamName, appName, date, month, year) {
  // Replace with your logic to upload the CSV data to Google Sheets
  const sheet = SpreadsheetApp.create(`Report-${teamName}-${appName}-${date}-${month}-${year}`).getActiveSheet();
  const rows = Utilities.parseCsv(csvData);
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  const spreadsheetUrl = sheet.getParent().getUrl();
  return spreadsheetUrl;
}

function visualizeData(spreadsheetUrl) {
  const spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  const sheet = spreadsheet.getActiveSheet();
  const data = sheet.getRange("A1:Z1000").getValues(); // Adjust range as necessary

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
      <h1>Description Data from Report</h1>
      <table>
        <tr>
          <th>Description</th>
        </tr>
  `;

  data.forEach(row => {
    if (row[2]) {  // Assuming Description is in the third column (index 2)
      htmlContent += `<tr><td>${row[2]}</td></tr>`;
    }
  });

  htmlContent += `
      </table>
    </body>
    </html>
  `;

  return htmlContent;
}
