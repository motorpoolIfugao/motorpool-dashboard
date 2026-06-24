const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

let currentReportData = [];

loadReport();

async function loadReport(){

    try{

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Report Data:", data);

        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;

        let filteredData = data;

        if(fromDate && toDate){

            filteredData = data.filter(task => {

                if(!task["Start Date"]) return true;

                const taskDate = getDateOnly(task["Start Date"]);

                return taskDate >= fromDate && taskDate <= toDate;
            });
        }

        currentReportData = filteredData;

        renderReport(filteredData);
        renderSummary(filteredData);

        if(fromDate && toDate){
            document.getElementById("reportPeriod").innerText =
                `Period Covered: ${formatDate(fromDate)} to ${formatDate(toDate)}`;
        }else{
            document.getElementById("reportPeriod").innerText =
                "All Recorded Weekly Work Plans";
        }

    }catch(error){

        console.error(error);

        document.getElementById("reportBody").innerHTML =
        `
        <tr>
            <td colspan="11">
                Error loading report data.
            </td>
        </tr>
        `;
    }
}

function renderSummary(data){

    let finished = 0;
    let ongoing = 0;
    let delayed = 0;
    let waiting = 0;
    let planned = 0;

    data.forEach(task => {

        const status =
            String(task["Status"] || "").toLowerCase();

        if(status === "finished") finished++;
        if(status === "ongoing") ongoing++;
        if(status === "delayed") delayed++;
        if(status === "planned") planned++;
        if(status.includes("waiting")) waiting++;
    });

    const total = data.length;

    const completionRate =
        total > 0
        ? Math.round((finished / total) * 100)
        : 0;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("finishedTasks").innerText = finished;
    document.getElementById("ongoingTasks").innerText = ongoing;
    document.getElementById("delayedTasks").innerText = delayed;
    document.getElementById("waitingTasks").innerText = waiting;
    document.getElementById("completionRate").innerText = completionRate + "%";
}

function renderReport(data){

    const reportBody =
        document.getElementById("reportBody");

    reportBody.innerHTML = "";

    if(data.length === 0){

        reportBody.innerHTML =
        `
        <tr>
            <td colspan="11" style="text-align:center;">
                No records found for the selected date range.
            </td>
        </tr>
        `;

        return;
    }

    data.forEach(task => {

        const status = task["Status"] || "";

        const statusClass =
            status.includes("Waiting")
            ? "Waiting"
            : status;

        reportBody.innerHTML += `
        <tr>
            <td>${task["No."] || ""}</td>
            <td>${task["Staff Name"] || ""}</td>
            <td>${task["Position"] || ""}</td>
            <td>${task["Vehicle/Equipment"] || ""}</td>
            <td>${task["Target Activity"] || ""}</td>
            <td>${formatDate(task["Start Date"])}</td>
            <td>${formatDate(task["Target Completion"])}</td>
            <td>${task["Actual Accomplishment"] || ""}</td>
            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>
            <td>${task["% Completion"] || ""}</td>
            <td>${task["Remarks"] || ""}</td>
        </tr>
        `;
    });
}

function getDateOnly(dateString){

    if(!dateString) return "";

    const date = new Date(dateString);

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString){

    if(!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-PH",{
        year:"numeric",
        month:"short",
        day:"numeric"
    });
}

function downloadExcel(){

    if(currentReportData.length === 0){
        alert("No data available to download.");
        return;
    }

    let table = `
    <table border="1">
        <tr>
            <th colspan="11" style="font-size:18px;">
                PROVINCIAL MOTORPOOL
            </th>
        </tr>
        <tr>
            <th colspan="11">
                Weekly Work Plan and Accomplishment Report
            </th>
        </tr>
        <tr>
            <th colspan="11">
                ${document.getElementById("reportPeriod").innerText}
            </th>
        </tr>
        <tr>
            <th>No.</th>
            <th>Staff</th>
            <th>Position</th>
            <th>Vehicle/Equipment</th>
            <th>Target Activity</th>
            <th>Start Date</th>
            <th>Target Completion</th>
            <th>Actual Accomplishment</th>
            <th>Status</th>
            <th>% Completion</th>
            <th>Remarks</th>
        </tr>
    `;

    currentReportData.forEach(task => {

        table += `
        <tr>
            <td>${task["No."] || ""}</td>
            <td>${task["Staff Name"] || ""}</td>
            <td>${task["Position"] || ""}</td>
            <td>${task["Vehicle/Equipment"] || ""}</td>
            <td>${task["Target Activity"] || ""}</td>
            <td>${formatDate(task["Start Date"])}</td>
            <td>${formatDate(task["Target Completion"])}</td>
            <td>${task["Actual Accomplishment"] || ""}</td>
            <td>${task["Status"] || ""}</td>
            <td>${task["% Completion"] || ""}</td>
            <td>${task["Remarks"] || ""}</td>
        </tr>
        `;
    });

    table += `</table>`;

    const file = new Blob([table], {
        type: "application/vnd.ms-excel"
    });

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Motorpool_Weekly_Report.xls";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}