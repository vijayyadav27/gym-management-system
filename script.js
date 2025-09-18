document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const loginForm = document.getElementById("loginForm");
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const mainContent = document.getElementById("mainContent");

  // Login handling (unchanged functionality)
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const role = document.getElementById("role").value;
      if (!role) { alert("Please select a valid role."); return; }
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("dashboardPage").style.display = "block";
      loadDashboard(role);
    });
  }

  // Sidebar toggle (menu button)
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      const isActive = sidebar.classList.toggle("active");
      overlay.classList.toggle("active", isActive);
      document.body.classList.toggle("no-scroll", isActive);
      // For a11y
      overlay.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  // Overlay click closes sidebar
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
      overlay.setAttribute("aria-hidden", "true");
    });
  }

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
      overlay.setAttribute("aria-hidden", "true");
    }
  });

  // Close sidebar when a sidebar link is clicked (mobile UX)
  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        // small delay so link navigation can occur if anchor
        setTimeout(() => {
          sidebar.classList.remove("active");
          overlay.classList.remove("active");
          document.body.classList.remove("no-scroll");
          overlay.setAttribute("aria-hidden", "true");
        }, 150);
      }
    });
  }

  // Export report (if you have this function)
  window.exportReport = function () {
    const csv = "Name,Email,Amount\nJohn Doe,john@example.com,2000\nJane Doe,jane@example.com,2500";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Logout
  window.logout = function () {
    // close any open mobile sidebar
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    document.getElementById("dashboardPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    // optionally reset forms/state here
  };

  // loadDashboard function (keeps the same as before; included here for completeness)
  window.loadDashboard = function (role) {
    const title = document.getElementById("dashboardTitle");
    sidebarMenu.innerHTML = "";
    mainContent.innerHTML = "";

    if (role === "admin") {
      title.textContent = "Admin Dashboard";
      sidebarMenu.innerHTML = `
        <li><a href="#addMember">Add Member</a></li>
        <li><a href="#manageMembers">Manage Members</a></li>
        <li><a href="#createBill">Create Bills</a></li>
        <li><a href="#feePackage">Assign Fee Package</a></li>
        <li><a href="#notifications">Notifications</a></li>
        <li><a href="#reports">Export Reports</a></li>
        <li><a href="#store">Supplement Store</a></li>
        <li><a href="#diet">Diet Details</a></li>
      `;
      mainContent.innerHTML = `
        <section id="addMember"><h2>Add Member</h2><form><input type="text" placeholder="Name"><input type="text" placeholder="Email"><button class="btn">Add</button></form></section>
        <section id="manageMembers"><h2>Manage Members</h2><p>John Doe - <button>Edit</button> <button>Delete</button></p></section>
        <section id="createBill"><h2>Create Bills</h2><form><input type="text" placeholder="Member Name"><input type="number" placeholder="Amount"><button class="btn">Generate</button></form></section>
        <section id="reports"><h2>Reports</h2><button class="btn" onclick="exportReport()">Download CSV</button></section>
      `;
    } else if (role === "member") {
      title.textContent = "Member Dashboard";
      sidebarMenu.innerHTML = `
        <li><a href="#bills">View Bills</a></li>
        <li><a href="#notifications">Notifications</a></li>
      `;
      mainContent.innerHTML = `
        <section id="bills"><h2>Bill Receipts</h2><p>Receipt #101 - Paid - ₹2000</p></section>
        <section id="notifications"><h2>Bill Notifications</h2><p>Your next payment is due on 30th September.</p></section>
      `;
    } else if (role === "user") {
      title.textContent = "User Dashboard";
      sidebarMenu.innerHTML = `
        <li><a href="#details">View Details</a></li>
        <li><a href="#search">Search Records</a></li>
      `;
      mainContent.innerHTML = `
        <section id="details"><h2>View Details</h2><p>Welcome, Guest User!</p></section>
        <section id="search"><h2>Search Records</h2><input type="text" placeholder="Search by name"><button class="btn">Search</button></section>
      `;
    }
  };
});
