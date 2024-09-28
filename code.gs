<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    /* Existing CSS code */
  </style>
</head>
<body>

  <h1>Generate CSV</h1>

  <label for="appDropdown">Application:</label>
  <div style="position: relative;">
    <input type="text" id="searchInput" onkeyup="filterDropdown()" placeholder="Search applications..." style="display:none; width: calc(100% - 20px); margin-bottom: 10px;">
    <select id="appDropdown" onclick="toggleSearchInput()"></select>
  </div>

  <button id="generateCsvButton" onclick="generateReport()">Generate CSV</button>

  <p id="loading">Loading applications, please wait...</p>
  
  <div id="statusMessage"></div>

  <div id="csvUploadSection">
    <h2>Upload CSV</h2>
    <label for="csvUpload">Upload CSV:</label>
    <input type="file" id="csvUpload" accept=".csv" />
    <button onclick="handleCsvUpload()">Upload CSV</button>
  </div>

  <div id="loadingAnimation">
    <div class="loading-animation"></div>
    <p id="loadingText">Generating Report...</p>
  </div>

  <div id="toast"></div>
  
  <div id="macroscopeNotification"></div>

  <script>
    let teamName, appName, date, month, year;

    function loadApplications() {
      document.getElementById('loading').style.display = 'block';
      
      google.script.run.withSuccessHandler(function(applications) {
        document.getElementById('loading').style.display = 'none';

        let dropdown = document.getElementById('appDropdown');
        
        if (applications.length === 0) {
          document.getElementById('statusMessage').innerText = "No applications found!";
          return;
        }
        
        applications.forEach(function(app) {
          let option = document.createElement('option');
          option.value = JSON.stringify({
            appId: app.appId, 
            engagementId: app.engagementId,
            name: app.name,
            team: app.team
          });
          option.text = app.name;
          dropdown.add(option);
        });
      }).getApplications();
    }

    function toggleSearchInput() {
      const searchInput = document.getElementById('searchInput');
      const dropdown = document.getElementById('appDropdown');

      if (searchInput.style.display === 'none') {
        searchInput.style.display = 'block';
        searchInput.focus();
      }

      dropdown.size = dropdown.options.length; // Expand the dropdown to show all options
    }

    function filterDropdown() {
      const input = document.getElementById('searchInput').value.toLowerCase();
      const dropdown = document.getElementById('appDropdown');

      for (let i = 0; i < dropdown.options.length; i++) {
        const optionText = dropdown.options[i].text.toLowerCase();
        dropdown.options[i].style.display = optionText.includes(input) ? '' : 'none';
      }
    }

    function generateReport() {
      let selectedValue = document.getElementById('appDropdown').value;
      let statusMessage = document.getElementById('statusMessage');

      if (!selectedValue) {
        statusMessage.innerText = "Please select an application!";
        statusMessage.style.color = "red";
        return;
      }

      let selectedIDs = JSON.parse(selectedValue);
      let appId = selectedIDs.appId;
      let engagementId = selectedIDs.engagementId;
      appName = selectedIDs.name;
      teamName = selectedIDs.team;

      document.getElementById('loadingText').innerText = "Generating Report...";
      document.getElementById('loadingAnimation').style.display = 'block';

      google.script.run.withSuccessHandler(function(downloadUrl) {
        let today = new Date();
        date = today.getDate();
        month = today.getMonth() + 1;
        year = today.getFullYear();

        const anchor = document.createElement('a');
        anchor.href = downloadUrl;
        anchor.download = `Report-${teamName}-${appName}-${date}-${month}-${year}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        document.getElementById('loadingAnimation').style.display = 'none';
        document.getElementById('csvUploadSection').style.display = 'block';
        
        showMacroscopeToast();
      }).generateCSV(appId, engagementId);
    }

    function handleCsvUpload() {
      let fileInput = document.getElementById('csvUpload');
      let file = fileInput.files[0];
      if (!file) {
        document.getElementById('statusMessage').innerText = "Please select a CSV file to upload!";
        document.getElementById('statusMessage').style.color = "red";
        return;
      }

      let reader = new FileReader();
      reader.onload = function(e) {
        let csvData = e.target.result;

        showAnimation();

        google.script.run.withSuccessHandler(function(sheetUrl) {
          hideAnimation();
          showToast(`Report Generated: <a href="${sheetUrl}" target="_blank" style="color: #4CAF50;">Link</a><br>Refresh the page for a new report.`);
          document.getElementById('appDropdown').innerHTML = '';
          fileInput.value = ''; // Clear the file input
        }).uploadFiles(csvData, teamName, appName, date, month, year);
      };

      reader.readAsText(file);
    }

    function showToast(message) {
      let toast = document.getElementById("toast");
      toast.innerHTML = message;
      toast.style.display = "block";
    }

    function showMacroscopeToast() {
      let macroscopeNotification = document.getElementById("macroscopeNotification");
      macroscopeNotification.innerText = "Macroscope sometimes takes time to give back a report. If the report is big, it may take time to download. Please wait for the download to start. Thank you.";
      macroscopeNotification.style.display = "block";

      setTimeout(function() {
        hideMacroscopeToast();
      }, 8000); // Change to 8 seconds
    }

    function hideMacroscopeToast() {
      let macroscopeNotification = document.getElementById("macroscopeNotification");
      macroscopeNotification.style.display = "none";
    }

    function showAnimation() {
      document.getElementById('loadingAnimation').style.display = 'block';
    }

    function hideAnimation() {
      document.getElementById('loadingAnimation').style.display = 'none';
    }

    function hideToast() {
      let toast = document.getElementById("toast");
      toast.style.display = "none";
    }

    document.addEventListener('DOMContentLoaded', loadApplications);
  </script>

</body>
</html>
