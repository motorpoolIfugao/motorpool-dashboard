(function(){

    const role = localStorage.getItem("role") || "";
    const fullName = localStorage.getItem("fullName") || "";
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    const sidebarContainer = document.getElementById("sidebarContainer");

    if(!sidebarContainer){
        return;
    }

    const menuItems = [
        {
            title: "Dashboard",
            href: "dashboard.html",
            roles: ["Admin", "Supervisor", "Mechanic", "Viewer"]
        },
        {
            title: "Assign Staff Task",
            href: "admin.html",
            roles: ["Admin"]
        },
        {
            title: "Submit My Task",
            href: "employee-task.html",
            roles: ["Admin", "Supervisor", "Mechanic"]
        },
        {
            title: "Task Management",
            href: "task-management.html",
            roles: ["Admin"]
        },
        {
            title: "User Management",
            href: "user-management.html",
            roles: ["Admin"]
        },
        {
            title: "Staff Management",
            href: "staff-management.html",
            roles: ["Admin"]
        },
        {
            title: "Vehicle Monitoring",
            href: "vehicles.html",
            roles: ["Admin", "Supervisor"]
        },
        {
            title: "Spare Parts",
            href: "spare-parts.html",
            roles: ["Admin", "Supervisor"]
        },
        {
            title: "Inventory",
            href: "inventory.html",
            roles: ["Admin", "Supervisor"]
        },
        {
            title: "Reports",
            href: "report.html",
            roles: ["Admin", "Supervisor", "Viewer"]
        },
        {
            title: "Supervisor Dashboard",
            href: "boss-dashboard.html",
            roles: ["Admin", "Supervisor", "Viewer"]
        }
    ];

    let menuHTML = "";

    menuItems.forEach(item => {

        if(item.roles.includes(role)){

            const activeClass =
                currentPage === item.href ? "active" : "";

            menuHTML += `
                <button class="${activeClass}" onclick="window.location.href='${item.href}'">
                    ${item.title}
                </button>
            `;
        }

    });

    sidebarContainer.innerHTML = `
        <aside class="sidebar">

            <div class="sidebar-header">
                <div class="sidebar-seal">IFG</div>
                <h2>Motorpool System</h2>
                <p>Province of Ifugao</p>
            </div>

            <div class="sidebar-user">
                Logged in as:<br>
                <strong>${fullName}</strong><br>
                <span>${role}</span>
            </div>

            <div class="sidebar-menu">
                ${menuHTML}

                <button class="sidebar-logout" onclick="logout()">
                    Logout
                </button>
            </div>

        </aside>
    `;

})();