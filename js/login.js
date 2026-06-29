const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

document.getElementById("loginForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.style.color = "#0b4f2f";
    message.innerText = "Logging in...";

    try{

        const response = await fetch(
            apiUrl +
            "?action=login&username=" +
            encodeURIComponent(username) +
            "&password=" +
            encodeURIComponent(password)
        );

        const data = await response.json();

        console.log("Login response:", data);

        if(data.success === true){

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("fullName", data.fullName);
            localStorage.setItem("role", data.role);

            window.location.href = "dashboard.html";

        }else{

            message.style.color = "#dc3545";
            message.innerText = data.message || "Invalid username or password.";

        }

    }catch(error){

        console.error("Login error:", error);

        message.style.color = "#dc3545";
        message.innerText = "Login failed. Please check your internet or Apps Script URL.";

    }

});