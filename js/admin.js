const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

let staffList = [];

document
  .getElementById("taskForm")
  .addEventListener("submit", saveTask);

loadStaff();
loadVehicles();

async function loadStaff() {

    const response = await fetch(apiUrl + "?action=staff");
    staffList = await response.json();

    const staffSelect = document.getElementById("staff");

    staffList.forEach(staff => {

        if (staff["Status"] === "Active") {

            staffSelect.innerHTML += `
                <option value="${staff["Staff Name"]}">
                    ${staff["Staff Name"]}
                </option>
            `;
        }
    });
}

async function loadVehicles() {

    const response = await fetch(apiUrl + "?action=vehicles");
    const vehicles = await response.json();

    const vehicleSelect = document.getElementById("vehicle");

    vehicles.forEach(vehicle => {

        vehicleSelect.innerHTML += `
            <option value="${vehicle["Vehicle/Equipment"]}">
                ${vehicle["Vehicle/Equipment"]} - ${vehicle["Plate No."]}
            </option>
        `;
    });
}

document
.getElementById("staff")
.addEventListener("change", function(){

    const selectedName = this.value;

    const selectedStaff = staffList.find(staff =>
        staff["Staff Name"] === selectedName
    );

    document.getElementById("position").value =
        selectedStaff ? selectedStaff["Position"] : "";
});

async function saveTask(e) {

    e.preventDefault();

    const task = {
        action: "create",
        staff: document.getElementById("staff").value,
        position: document.getElementById("position").value,
        vehicle: document.getElementById("vehicle").value,
        target: document.getElementById("target").value,
        startDate: document.getElementById("startDate").value,
        targetCompletion: document.getElementById("targetCompletion").value,
        status: document.getElementById("status").value
    };

    try {

        await fetch(apiUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        document.getElementById("message").innerHTML =
            "Task saved successfully. Please check the dashboard.";

        document.getElementById("taskForm").reset();

    } catch (error) {

        console.error(error);

        document.getElementById("message").innerHTML =
            "Error saving task.";
    }
}