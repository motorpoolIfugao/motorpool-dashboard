function login(){

    const user =
    document.getElementById("username").value;

    const pass =
    document.getElementById("password").value;

    if(user==="admin" && pass==="1234")
    {
        window.location="index.html";
    }
    else
    {
        alert("Invalid Login");
    }
}