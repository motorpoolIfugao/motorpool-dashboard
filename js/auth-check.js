const isLoggedIn = localStorage.getItem("isLoggedIn");
const role = localStorage.getItem("role");
const fullName = localStorage.getItem("fullName");

if(isLoggedIn !== "true"){
    window.location.href = "login.html";
}

function logout(){
    localStorage.clear();
    window.location.href = "login.html";
}

function allowRoles(allowedRoles){

    if(!allowedRoles.includes(role)){
        alert("You are not allowed to access this page.");
        window.location.href = "dashboard.html";
    }
}