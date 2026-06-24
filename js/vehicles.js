let vehicleList = [];

const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

function normalizeText(value) {
return String(value || "")
.toLowerCase()
.replace(/[^a-z0-9]/g, "")
.trim();
}

document
.getElementById("vehicleForm")
.addEventListener("submit", saveVehicle);

loadVehicles();

async function saveVehicle(e){


e.preventDefault();

const plateNo =
    document.getElementById("plateNo").value;

const vehicleName =
    document.getElementById("vehicleName").value;

const department =
    document.getElementById("department").value;

const status =
    document.getElementById("status").value;

const duplicatePlate = vehicleList.some(vehicle =>
    normalizeText(vehicle["Plate No."]) === normalizeText(plateNo)
);

const duplicateName = vehicleList.some(vehicle =>
    normalizeText(vehicle["Vehicle/Equipment"]) === normalizeText(vehicleName)
);

if(duplicatePlate){
    document.getElementById("message").innerHTML =
        "Duplicate vehicle detected. Plate number already exists.";
    return;
}

if(duplicateName){
    const confirmDuplicate = confirm(
        "A vehicle with a similar name already exists. Do you still want to continue?"
    );

    if(!confirmDuplicate){
        return;
    }
}

const vehicle = {
    action: "createVehicle",
    plateNo: plateNo,
    vehicleName: vehicleName,
    department: department,
    status: status
};

try{

    await fetch(apiUrl,{
        method:"POST",
        mode:"no-cors",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(vehicle)
    });

    document.getElementById("message").innerHTML =
        "Vehicle saved successfully.";

    document.getElementById("vehicleForm").reset();

    setTimeout(loadVehicles, 1000);

}catch(error){

    console.error(error);

    document.getElementById("message").innerHTML =
        "Error saving vehicle.";
}


}

async function loadVehicles(){


try{

    const response =
        await fetch(apiUrl + "?action=vehicles");

    const vehicles =
        await response.json();

    vehicleList = vehicles;

    const vehicleBody =
        document.getElementById("vehicleBody");

    vehicleBody.innerHTML = "";

    vehicles.forEach((vehicle, index) => {

        const status =
            vehicle["Status"] || "";

        const statusClass =
            status.replaceAll(" ", "-");

        vehicleBody.innerHTML += `
        <tr>
            <td>${vehicle["Vehicle ID"] || ""}</td>
            <td>${vehicle["Plate No."] || ""}</td>
            <td>${vehicle["Vehicle/Equipment"] || ""}</td>
            <td>${vehicle["Department"] || ""}</td>

            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>

            <td>
                <select id="status-${index}">
                    <option ${status === "Operational" ? "selected" : ""}>Operational</option>
                    <option ${status === "Under Repair" ? "selected" : ""}>Under Repair</option>
                    <option ${status === "Waiting for Parts" ? "selected" : ""}>Waiting for Parts</option>
                    <option ${status === "For PMS" ? "selected" : ""}>For PMS</option>
                    <option ${status === "Unserviceable" ? "selected" : ""}>Unserviceable</option>
                </select>
            </td>

            <td>
                <button onclick="updateVehicleStatus(${index})">
                    Save
                </button>
            </td>
        </tr>
        `;
    });

}catch(error){

    console.error(error);

    document.getElementById("message").innerHTML =
        "Error loading vehicles.";
}


}

async function updateVehicleStatus(index){


const vehicleId =
    vehicleList[index]["Vehicle ID"];

const newStatus =
    document.getElementById("status-" + index).value;

const request = {
    action: "updateVehicleStatus",
    vehicleId: vehicleId,
    status: newStatus
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
        "Vehicle status updated successfully.";

    setTimeout(loadVehicles, 1000);

}catch(error){

    console.error(error);

    document.getElementById("message").innerHTML =
        "Error updating vehicle status.";
}

}
