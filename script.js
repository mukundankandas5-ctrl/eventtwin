const events = [
  { name: "AI Hackathon", fee: 200, details: "24hr coding competition" },
  { name: "Tech Quiz", fee: 100, details: "Technical battle" },
  { name: "Startup Pitch", fee: 300, details: "Pitch your idea" },
  { name: "Cultural Night", fee: 150, details: "Dance & music" },
  { name: "Gaming Tournament", fee: 250, details: "Esports event" }
];

/* Populate Event Dropdown */
if (document.getElementById("eventSelect")) {
  let select = document.getElementById("eventSelect");
  events.forEach((e, i) => {
    let option = document.createElement("option");
    option.value = i;
    option.text = `${e.name} - ₹${e.fee}`;
    select.add(option);
  });
}

/* Show Event Details */
function showEventDetails() {
  let idx = document.getElementById("eventSelect").value;
  if (idx === "") return;

  let e = events[idx];
  document.getElementById("eventDetails").innerHTML =
    `<b>${e.name}</b><br>${e.details}<br>Fee: ₹${e.fee}`;
}

/* Payment Simulation */
function proceedPayment() {
  let name = document.getElementById("name").value;
  let college = document.getElementById("college").value;
  let dept = document.getElementById("dept").value;
  let idx = document.getElementById("eventSelect").value;

  if (!name || !college || !dept || idx === "") {
    alert("Fill all fields");
    return;
  }

  setTimeout(() => {
    completeRegistration(name, college, dept, events[idx].name);
  }, 1500);
}

function completeRegistration(name, college, dept, eventName) {

  let students = JSON.parse(localStorage.getItem("students")) || [];
  let id = "EVT" + Date.now();

  students.push({
    id, name, college, dept,
    event: eventName,
    redeemed: false,
    loggedIn: true
  });

  localStorage.setItem("students", JSON.stringify(students));

  document.getElementById("registrationCard").classList.add("hidden");
  document.getElementById("successSection").classList.remove("hidden");

  document.getElementById("wristband").innerHTML =
    `<h3>${name}</h3>
     <p>${eventName}</p>
     <p>ID: ${id}</p>
     <div id="qr"></div>`;

  new QRCode(document.getElementById("qr"), id);
}

/* WhatsApp */
function joinWhatsApp() {
  window.open("https://chat.whatsapp.com/Gr4g8eXvZtWH0oK4kCMn7h?mode=gi_t", "_blank");
}

/* STAFF SCANNER */
function initStaffScanner() {

  function updateCount() {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    document.getElementById("redeemCount").innerText =
      students.filter(s => s.redeemed).length;
  }

  updateCount();

  function onScanSuccess(decodedText) {

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let student = students.find(s => s.id === decodedText);
    let status = document.getElementById("scanStatus");

    if (!student) {
      status.innerHTML = "❌ Invalid QR";
      status.className = "status-box status-error";
      return;
    }

    if (student.redeemed) {
      status.innerHTML = `⚠ Already Redeemed<br>${student.name}`;
      status.className = "status-box status-warning";
      return;
    }

    student.redeemed = true;
    localStorage.setItem("students", JSON.stringify(students));

    status.innerHTML =
      `✅ Access Granted<br>${student.name}<br>${student.event}`;
    status.className = "status-box status-success";

    updateCount();
  }

  const html5QrCode = new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  );
}

/* ADMIN */
function loadAdmin() {
  let students = JSON.parse(localStorage.getItem("students")) || [];

  document.getElementById("totalReg").innerText = students.length;
  document.getElementById("loggedIn").innerText =
    students.filter(s => s.loggedIn).length;
  document.getElementById("redeemed").innerText =
    students.filter(s => s.redeemed).length;
  document.getElementById("footfall").innerText = students.length;

  let table = document.getElementById("studentTable");

  students.forEach(s => {
    let row = table.insertRow();
    row.insertCell(0).innerText = s.name;
    row.insertCell(1).innerText = s.college;
    row.insertCell(2).innerText = s.dept;
    row.insertCell(3).innerText = s.event;
    row.insertCell(4).innerText = s.redeemed ? "Yes" : "No";
  });
}