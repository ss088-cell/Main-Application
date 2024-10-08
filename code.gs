// Serve the HTML page
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to get the applications, IDs, and team name from the Google Sheet
function getApplications() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ApplicationData');
  const data = sheet.getDataRange().getValues();
  const applications = [];

  for (let i = 1; i < data.length; i++) {
    const appId = data[i][0];
    const engagementId = data[i][1];
    const name = data[i][2];
    const team = data[i][3];

    if (appId && engagementId && name && team) {
      applications.push({ appId, engagementId, name, team });
    }
  }

  return applications;
}

// Function to generate the CSV
function generateCSV(appId, engagementId, appName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Template');
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  const csvContent = [];
  data.forEach(rowArray => {
    const row = rowArray.join(",");
    csvContent.push(row);
  });

  // Use the application name for the CSV file name
  const csvBlob = Utilities.newBlob(csvContent.join("\n"), 'text/csv', `${appName}.csv`);
  const file = DriveApp.createFile(csvBlob);

  return file.getDownloadUrl();
}

// Function to upload the CSV and generate the report
function uploadFiles(csvData, teamName, appName, date, month, year) {
  const sheet = SpreadsheetApp.create(`Report-${teamName}-${appName}-${date}-${month}-${year}`);
  const csvArray = Utilities.parseCsv(csvData);

  const newSheet = sheet.getActiveSheet();
  newSheet.getRange(1, 1, csvArray.length, csvArray[0].length).setValues(csvArray);

  const url = sheet.getUrl();
  return url;
}

// Function to visualize the data
function visualizeData(sheetUrl) {
  const html = `
    <html>
    <head>
      <title>Data Visualization</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <h1>Data Visualization</h1>
      <p>Visual representation of the data from the generated report.</p>
      <canvas id="myChart" width="400" height="400"></canvas>
      <script>
        // Assuming some basic data for chart creation
        const data = {
          labels: ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'],
          datasets: [{
            label: 'Sample Data',
            data: [10, 20, 30, 40, 50],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };
        
        const config = {
          type: 'bar',
          data: data,
        };
        
        const myChart = new Chart(
          document.getElementById('myChart'),
          config
        );
      </script>
    </body>
    </html>
  `;
  
  return html;
}
