const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

if(localStorage.getItem("role") !== "Admin"){
    document.getElementById("taskManagementBtn").style.display = "none";
}

const userRole = localStorage.getItem("role");

if(userRole !== "Admin"){
    document.getElementById("adminBtn").style.display = "none";
}

document.getElementById("userInfo").innerText =
    "Logged in as: " +
    localStorage.getItem("fullName") +
    " (" +
    localStorage.getItem("role") +
    ")";

loadTasks();

async function loadTasks(){

    const response = await fetch(apiUrl);
    const data = await response.json();

    const tableBody =
    document.getElementById("tableBody");

    tableBody.innerHTML = "";

    let planned = 0;
    let ongoing = 0;
    let finished = 0;

    data.forEach(task => {

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
        <span class="status ${task["Status"] || ""}">
            ${task["Status"] || ""}
        </span>
    </td>

    <td>${task["% Completion"] || ""}</td>

    <td>${task["Remarks"] || ""}</td>

    <td>
        <button onclick="openUpdate(${task["No."]})">
            ✏️ Update
        </button>
    </td>
</tr>
`;

        if(task["Status"] === "Planned")
            planned++;

        if(task["Status"] === "Ongoing")
            ongoing++;

        if(task["Status"] === "Finished")
            finished++;
    });

    document.getElementById("totalTasks")
        .innerText = data.length;

    document.getElementById("plannedTasks")
        .innerText = planned;

    document.getElementById("ongoingTasks")
        .innerText = ongoing;

    document.getElementById("finishedTasks")
        .innerText = finished;
}

function filterTable(){

    let input =
    document.getElementById("search")
    .value.toUpperCase();

    let rows =
    document.querySelectorAll("#taskTable tbody tr");

    rows.forEach(row=>{

        let text =
        row.innerText.toUpperCase();

        row.style.display =
        text.includes(input)
        ? ""
        : "none";

    });
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
function openUpdate(taskNo){

    window.location.href =
    `update.html?task=${taskNo}`;

}