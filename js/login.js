const apiUrl =
"https://script.google.com/macros/s/AKfycby_b_Wqi3toY94kYQhajzMzZDTZx4g3dB6-S5HoUmBf6TcfzhmevxYylo77-HO6tNGU/exec";

async function login(){

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if(!username || !password){
        document.getElementById("message").innerHTML =
            "Please enter username and password.";
        return;
    }

    try{

        const response = await fetch(
            apiUrl +
            "?action=login" +
            "&username=" + encodeURIComponent(username) +
            "&password=" + encodeURIComponent(password)
        );

        const result = await response.json();

        if(result.success){

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("fullName", result.fullName);
            localStorage.setItem("role", result.role);

            window.location.href = "dashboard.html";

        }else{

            document.getElementById("message").innerHTML =
                result.message || "Invalid login.";
        }

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
            "Login error. Please try again.";
    }
}