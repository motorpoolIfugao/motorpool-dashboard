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

let dashboardTasks = [];

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

        dashboardTasks =
            Array.isArray(data)
            ? data
            : [];

        renderMainTable(dashboardTasks);
        renderDashboardSummary(dashboardTasks);
        renderPositionSummary(dashboardTasks);
        renderNextWeekTargets(dashboardTasks);

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

function renderDashboardSummary(data){

    let planned = 0;
    let ongoing = 0;
    let finished = 0;
    let delayed = 0;

    data.forEach(task => {

        const status =
            String(task["Status"] || "").trim().toLowerCase();

        if(status === "planned") planned++;
        if(status === "ongoing") ongoing++;
        if(status === "finished") finished++;
        if(status === "delayed") delayed++;
    });

    document.getElementById("totalTasks").innerText =
        data.length;

    document.getElementById("plannedTasks").innerText =
        planned;

    document.getElementById("ongoingTasks").innerText =
        ongoing;

    document.getElementById("finishedTasks").innerText =
        finished;

    document.getElementById("delayedTasks").innerText =
        delayed;
}

function renderPositionSummary(data){

    const positionSummary = {};

    data.forEach(task => {

        const position =
            task["Position"] || "Unspecified";

        const status =
            String(task["Status"] || "").trim().toLowerCase();

        if(!positionSummary[position]){
            positionSummary[position] = {
                total: 0,
                finished: 0,
                unfinished: 0,
                delayed: 0
            };
        }

        positionSummary[position].total++;

        if(status === "finished"){
            positionSummary[position].finished++;
        }else{
            positionSummary[position].unfinished++;
        }

        if(status === "delayed"){
            positionSummary[position].delayed++;
        }
    });

    const positionBody =
        document.getElementById("positionBody");

    positionBody.innerHTML = "";

    const positions =
        Object.keys(positionSummary);

    if(positions.length === 0){

        positionBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No position summary available.
                </td>
            </tr>
        `;

        return;
    }

    positions.forEach(position => {

        const item =
            positionSummary[position];

        positionBody.innerHTML += `
            <tr>
                <td>${safeText(position)}</td>
                <td>${item.total}</td>
                <td>${item.finished}</td>
                <td>${item.unfinished}</td>
                <td>${item.delayed}</td>
            </tr>
        `;
    });
}

function renderNextWeekTargets(data){

    const nextWeek =
        getNextWeekRange();

    document.getElementById("nextWeekPeriod").innerText =
        "Target Period: " +
        formatDisplayDate(nextWeek.start) +
        " to " +
        formatDisplayDate(nextWeek.end);

    const nextWeekTasks =
        data.filter(task => {

            const status =
                String(task["Status"] || "").trim().toLowerCase();

            return (
                taskOverlapsPeriod(task, nextWeek.start, nextWeek.end) &&
                status !== "finished"
            );
        });

    const nextWeekBody =
        document.getElementById("nextWeekBody");

    nextWeekBody.innerHTML = "";

    if(nextWeekTasks.length === 0){

        nextWeekBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No unfinished target activities found for next week.
                </td>
            </tr>
        `;

        return;
    }

    nextWeekTasks.forEach(task => {

        const status =
            task["Status"] || "";

        const statusClass =
            getStatusClass(status);

        nextWeekBody.innerHTML += `
            <tr>
                <td>${safeText(task["No."])}</td>
                <td>${safeText(task["Staff Name"])}</td>
                <td>${safeText(task["Position"])}</td>
                <td>${safeText(task["Vehicle/Equipment"])}</td>
                <td>${safeText(task["Target Activity"])}</td>
                <td>${formatDate(task["Start Date"])}</td>
                <td>${formatDate(task["Target Completion"])}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${safeText(status)}
                    </span>
                </td>
                <td>${safeText(task["Remarks"])}</td>
            </tr>
        `;
    });
}

function renderMainTable(data){

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    if(!Array.isArray(data) || data.length === 0){

        tableBody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;">
                    No records found.
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(task => {

        const status =
            task["Status"] || "";

        const statusClass =
            getStatusClass(status);

        const canUpdate =
            dashboardRole === "Admin" ||
            dashboardRole === "Supervisor" ||
            dashboardRole === "Mechanic";

        const actionButton =
            canUpdate
            ? `
                <button onclick="openUpdate('${safeText(task["No."])}')">
                    Update
                </button>
              `
            : "";

        tableBody.innerHTML += `
            <tr>
                <td>${safeText(task["No."])}</td>
                <td>${safeText(task["Staff Name"])}</td>
                <td>${safeText(task["Position"])}</td>
                <td>${safeText(task["Vehicle/Equipment"])}</td>
                <td>${safeText(task["Target Activity"])}</td>
                <td>${formatDate(task["Start Date"])}</td>
                <td>${formatDate(task["Target Completion"])}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${safeText(status)}
                    </span>
                </td>

                <td>${safeText(task["% Completion"])}</td>
                <td>${safeText(task["Remarks"])}</td>
                <td>${actionButton}</td>
            </tr>
        `;
    });
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

function taskOverlapsPeriod(task, periodStart, periodEnd){

    const startDate =
        getDateOnly(task["Start Date"]);

    const targetDate =
        getDateOnly(task["Target Completion"]);

    if(!startDate && !targetDate){
        return false;
    }

    const taskStart =
        startDate || targetDate;

    const taskEnd =
        targetDate || startDate;

    return taskStart <= periodEnd && taskEnd >= periodStart;
}

function getNextWeekRange(){

    const today =
        new Date();

    const day =
        today.getDay();

    const daysUntilNextMonday =
        day === 0
        ? 1
        : 8 - day;

    const nextMonday =
        new Date(today);

    nextMonday.setDate(today.getDate() + daysUntilNextMonday);

    const nextSunday =
        new Date(nextMonday);

    nextSunday.setDate(nextMonday.getDate() + 6);

    return {
        start: toInputDate(nextMonday),
        end: toInputDate(nextSunday)
    };
}

function getDateOnly(dateString){

    if(!dateString){
        return "";
    }

    const date =
        new Date(dateString);

    if(isNaN(date)){
        return String(dateString).substring(0, 10);
    }

    return toInputDate(date);
}

function toInputDate(date){

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function formatDate(dateString){

    if(!dateString){
        return "";
    }

    const date =
        new Date(dateString);

    if(isNaN(date)){
        return safeText(dateString);
    }

    return date.toLocaleDateString("en-PH",{
        year:"numeric",
        month:"short",
        day:"numeric"
    });
}

function formatDisplayDate(dateString){

    const date =
        new Date(dateString);

    return date.toLocaleDateString("en-PH",{
        year:"numeric",
        month:"short",
        day:"numeric"
    });
}

function getStatusClass(status){

    return String(status || "")
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "");
}

function safeText(value){

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function openUpdate(taskNo){

    window.location.href =
        `update.html?task=${taskNo}`;
}