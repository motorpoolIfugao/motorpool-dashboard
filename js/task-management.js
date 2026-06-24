const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

let taskList = [];
let staffList = [];
let vehicleList = [];

loadAllData();

async function loadAllData(){

    await loadStaff();
    await loadVehicles();
    await loadTasks();
}

async function loadTasks(){

    const response =
        await fetch(apiUrl + "?action=tasks");

    taskList =
        await response.json();

    renderTasks(taskList);
}

async function loadStaff(){

    const response =
        await fetch(apiUrl + "?action=staff");

    staffList =
        await response.json();

    const staffSelect =
        document.getElementById("editStaff");

    staffSelect.innerHTML =
        `<option value="">Select Staff</option>`;

    staffList.forEach(staff => {

        if(staff["Status"] === "Active"){

            staffSelect.innerHTML += `
                <option value="${staff["Staff Name"]}">
                    ${staff["Staff Name"]}
                </option>
            `;
        }
    });

    staffSelect.addEventListener("change", function(){

        const selectedStaff =
            staffList.find(staff =>
                staff["Staff Name"] === this.value
            );

        document.getElementById("editPosition").value =
            selectedStaff ? selectedStaff["Position"] : "";
    });
}

async function loadVehicles(){

    const response =
        await fetch(apiUrl + "?action=vehicles");

    vehicleList =
        await response.json();

    const vehicleSelect =
        document.getElementById("editVehicle");

    vehicleSelect.innerHTML =
        `<option value="">Select Vehicle</option>`;

    vehicleList.forEach(vehicle => {

        vehicleSelect.innerHTML += `
            <option value="${vehicle["Vehicle/Equipment"]}">
                ${vehicle["Vehicle/Equipment"]} - ${vehicle["Plate No."]}
            </option>
        `;
    });
}

function renderTasks(tasks){

    const taskBody =
        document.getElementById("taskBody");

    taskBody.innerHTML = "";

    if(tasks.length === 0){

        taskBody.innerHTML =
        `
        <tr>
            <td colspan="7" style="text-align:center;">
                No tasks found.
            </td>
        </tr>
        `;

        return;
    }

    tasks.forEach(task => {

        taskBody.innerHTML += `
        <tr>
            <td>${task["No."] || ""}</td>
            <td>${task["Staff Name"] || ""}</td>
            <td>${task["Vehicle/Equipment"] || ""}</td>
            <td>${task["Target Activity"] || ""}</td>
            <td>${task["Status"] || ""}</td>
            <td>${task["% Completion"] || ""}</td>
            <td>
                <button class="edit-btn" onclick="openEdit('${task["No."]}')">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteTask('${task["No."]}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function openEdit(taskNo){

    const task =
        taskList.find(row =>
            String(row["No."]) === String(taskNo)
        );

    if(!task){
        alert("Task not found.");
        return;
    }

    document.getElementById("editNo").value =
        task["No."] || "";

    document.getElementById("editStaff").value =
        task["Staff Name"] || "";

    document.getElementById("editPosition").value =
        task["Position"] || "";

    document.getElementById("editVehicle").value =
        task["Vehicle/Equipment"] || "";

    document.getElementById("editTarget").value =
        task["Target Activity"] || "";

    document.getElementById("editStartDate").value =
        toInputDate(task["Start Date"]);

    document.getElementById("editTargetCompletion").value =
        toInputDate(task["Target Completion"]);

    document.getElementById("editActual").value =
        task["Actual Accomplishment"] || "";

    document.getElementById("editStatus").value =
        task["Status"] || "Planned";

    document.getElementById("editPercent").value =
        task["% Completion"] || "";

    document.getElementById("editRemarks").value =
        task["Remarks"] || "";

    document.getElementById("editModal").style.display =
        "block";
}

function closeModal(){

    document.getElementById("editModal").style.display =
        "none";
}

async function saveTaskEdit(){

    const request = {
        action: "editTaskDetails",
        no: document.getElementById("editNo").value,
        staff: document.getElementById("editStaff").value,
        position: document.getElementById("editPosition").value,
        vehicle: document.getElementById("editVehicle").value,
        target: document.getElementById("editTarget").value,
        startDate: document.getElementById("editStartDate").value,
        targetCompletion: document.getElementById("editTargetCompletion").value,
        actual: document.getElementById("editActual").value,
        status: document.getElementById("editStatus").value,
        percent: document.getElementById("editPercent").value,
        remarks: document.getElementById("editRemarks").value
    };

    try{

        await fetch(apiUrl,{
            method:"POST",
            mode:"no-cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        });

        document.getElementById("message").innerHTML =
            "Task updated successfully.";

        closeModal();

        setTimeout(loadTasks, 1000);

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
            "Error updating task.";
    }
}

async function deleteTask(taskNo){

    const confirmDelete =
        confirm("Are you sure you want to delete Task No. " + taskNo + "?");

    if(!confirmDelete){
        return;
    }

    const request = {
        action: "deleteTask",
        no: taskNo
    };

    try{

        await fetch(apiUrl,{
            method:"POST",
            mode:"no-cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(request)
        });

        document.getElementById("message").innerHTML =
            "Task deleted successfully.";

        setTimeout(loadTasks, 1000);

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
            "Error deleting task.";
    }
}

function filterTable(){

    const input =
        document.getElementById("search").value.toLowerCase();

    const filtered =
        taskList.filter(task =>
            JSON.stringify(task).toLowerCase().includes(input)
        );

    renderTasks(filtered);
}

function toInputDate(dateString){

    if(!dateString){
        return "";
    }

    const date =
        new Date(dateString);

    if(isNaN(date)){
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}