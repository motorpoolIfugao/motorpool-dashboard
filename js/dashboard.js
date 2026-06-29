const dashboardApiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

const dashboardFullName =
    localStorage.getItem("fullName") || "";

const dashboardRole =
    localStorage.getItem("role") || "";

const userInfoBox =
    document.getElementById("userInfo");

if(userInfoBox){
    userInfoBox.innerText =
        "Logged in as: " +
        dashboardFullName +
        " (" +
        dashboardRole +
        ")";
}

loadTasks();

async function loadTasks(){

    const tableBody =
        document.getElementById("tableBody");

    try{

        tableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;">
                    Loading dashboard data...
                </td>
            </tr>
        `;

        const response =
            await fetch(dashboardApiUrl + "?action=tasks");

        const data =
            await response.json();

        tableBody.innerHTML = "";

        let planned = 0;
        let ongoing = 0;
        let finished = 0;

        if(!Array.isArray(data) || data.length === 0){

            tableBody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align:center;">
                        No records found.
                    </td>
                </tr>
            `;

            updateSummary(0, 0, 0, 0);
            return;
        }

        data.forEach(task => {

            const status =
                task["Status"] || "";

            const statusClass =
                status.replaceAll(" ", "-");

            tableBody.innerHTML += `
                <tr>
                    <td>${task["No."] || ""}</td>
                    <td>${task["Staff Name"] || ""}</td>
                    <td>${task["Position"] || ""}</td>
                    <td>${task["Vehicle/Equipment"] || ""}</td>
                    <td>${task["Target Activity"] || ""}</td>
                    <td>${formatDate(task["Start Date"])}</td>
                    <td>${formatDate(task["Target Completion"])}</td>

                    <td>
                        <span class="status ${statusClass}">
                            ${status}
                        </span>
                    </td>

                    <td>${task["% Completion"] || ""}</td>
                    <td>${task["Remarks"] || ""}</td>

                    <td>
                        <button onclick="openUpdate('${task["No."]}')">
                            Update
                        </button>
                    </td>
                </tr>
            `;

            if(status === "Planned") planned++;
            if(status === "Ongoing") ongoing++;
            if(status === "Finished") finished++;

        });

        updateSummary(data.length, planned, ongoing, finished);

    }catch(error){

        console.error("Dashboard loading error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;color:red;">
                    Error loading dashboard data.
                </td>
            </tr>
        `;
    }
}

function updateSummary(total, planned, ongoing, finished){

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("plannedTasks").innerText = planned;
    document.getElementById("ongoingTasks").innerText = ongoing;
    document.getElementById("finishedTasks").innerText = finished;
}

function filterTable(){

    const searchInput =
        document.getElementById("search");

    if(!searchInput) return;

    const input =
        searchInput.value.toUpperCase();

    const rows =
        document.querySelectorAll("#taskTable tbody tr");

    rows.forEach(row => {

        const text =
            row.innerText.toUpperCase();

        row.style.display =
            text.includes(input)
            ? ""
            : "none";

    });
}

function formatDate(dateString){

    if(!dateString) return "";

    const date =
        new Date(dateString);

    if(isNaN(date)){
        return dateString;
    }

    return date.toLocaleDateString("en-PH",{
        year:"numeric",
        month:"short",
        day:"numeric"
    });
}

function openUpdate(taskNo){

    window.location.href =
        `update.html?task=${taskNo}`;
}