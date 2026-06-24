const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

const params = new URLSearchParams(window.location.search);
const taskNo = params.get("task");

document.getElementById("taskNo").value = taskNo;
document.getElementById("displayNo").innerText = taskNo;

loadTaskDetails();

async function loadTaskDetails(){

    try{

        const response = await fetch(apiUrl);
        const data = await response.json();

        const task = data.find(row =>
            String(row["No."]) === String(taskNo)
        );

        if(!task){
            document.getElementById("message").innerHTML =
            "Task not found.";
            return;
        }

        document.getElementById("displayStaff").innerText =
            task["Staff Name"] || "";

        document.getElementById("displayVehicle").innerText =
            task["Vehicle/Equipment"] || "";

        document.getElementById("displayTarget").innerText =
            task["Target Activity"] || "";

        document.getElementById("actual").value =
            task["Actual Accomplishment"] || "";

        document.getElementById("status").value =
            task["Status"] || "Planned";

        document.getElementById("percent").value =
            task["% Completion"] || "0%";

        document.getElementById("remarks").value =
            task["Remarks"] || "";

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
        "Error loading task details.";
    }
}

async function saveUpdate(){

    const task = {
        action: "update",
        no: taskNo,
        actual: document.getElementById("actual").value,
        status: document.getElementById("status").value,
        percent: document.getElementById("percent").value,
        remarks: document.getElementById("remarks").value
    };

    try{

        await fetch(apiUrl,{
            method:"POST",
            mode:"no-cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(task)
        });

        document.getElementById("message").innerHTML =
        "Task update sent successfully. Please check the dashboard.";

        setTimeout(function(){
            window.location.href = "dashboard.html";
        }, 1500);

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
        "Error updating task.";
    }
}