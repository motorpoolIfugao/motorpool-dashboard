const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

async function updateTask(){

    const task = {

        no:
        document.getElementById("taskNo").value,

        actual:
        document.getElementById("actual").value,

        status:
        document.getElementById("status").value,

        percent:
        document.getElementById("percent").value,

        remarks:
        document.getElementById("remarks").value
    };

    document.getElementById("message").innerHTML =
    "Task update feature coming next step.";
}