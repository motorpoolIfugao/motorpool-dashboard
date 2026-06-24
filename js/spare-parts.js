const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

document
.getElementById("partsForm")
.addEventListener("submit", savePartRequest);

loadVehicles();
loadParts();

async function loadVehicles(){

    const response =
        await fetch(apiUrl + "?action=vehicles");

    const vehicles =
        await response.json();

    const vehicleSelect =
        document.getElementById("vehicle");

    vehicles.forEach(vehicle => {

        vehicleSelect.innerHTML += `
            <option value="${vehicle["Vehicle/Equipment"]}">
                ${vehicle["Vehicle/Equipment"]} - ${vehicle["Plate No."]}
            </option>
        `;
    });
}

async function savePartRequest(e){

    e.preventDefault();

    const request = {
        action: "createPart",
        dateRequested: document.getElementById("dateRequested").value,
        vehicle: document.getElementById("vehicle").value,
        partNeeded: document.getElementById("partNeeded").value,
        quantity: document.getElementById("quantity").value,
        status: document.getElementById("status").value
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
            "Spare part request sent successfully.";

        document.getElementById("partsForm").reset();

        setTimeout(loadParts, 1000);

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
            "Error saving spare part request.";
    }
}

async function loadParts(){

    const response =
        await fetch(apiUrl + "?action=parts");

    const parts =
        await response.json();

    const partsBody =
        document.getElementById("partsBody");

    partsBody.innerHTML = "";

    parts.forEach(part => {

        const status =
            part["Status"] || "";

        partsBody.innerHTML += `
        <tr>
            <td>${formatDate(part["Date Requested"])}</td>
            <td>${part["Vehicle"] || ""}</td>
            <td>${part["Part Needed"] || ""}</td>
            <td>${part["Quantity"] || ""}</td>
            <td>
                <span class="status ${status}">
                    ${status}
                </span>
            </td>
        </tr>
        `;
    });
}

function formatDate(dateString){

    if(!dateString) return "";

    const date =
        new Date(dateString);

    return date.toLocaleDateString("en-PH",{
        year:"numeric",
        month:"short",
        day:"numeric"
    });
}