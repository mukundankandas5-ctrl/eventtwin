let totalFood = 300;
let totalSeats = 200;

function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(data) {
  localStorage.setItem("students", JSON.stringify(data));
}

function showSection(section) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
  updateAdmin();
}

function registerStudent() {
  let name = document.getElementById("studentName").value.trim();
  if (!name) {
    alert("Enter name");
    return;
  }

  let students = getStudents();
  let id = "ID" + Date.now();

  students.push({
    id: id,
    name: name,
    redeemed: false
  });

  saveStudents(students);

  generateWristband(name, id);
  updateAdmin();
}

function generateWristband(name, id) {
  let wristband = document.getElementById("wristband");
  wristband.innerHTML = `
    <h3>${name}</h3>
    <p>Event Access Wristband</p>
    <p>ID: ${id}</p>
    <div id="qrcode"></div>
  `;

  new QRCode(document.getElementById("qrcode"), id);
}

function redeemFood() {
  let id = document.getElementById("scanInput").value.trim();
  let students = getStudents();
  let status = document.getElementById("redeemStatus");

  let student = students.find(s => s.id === id);

  if (!student) {
    status.innerText = "Invalid QR!";
    status.style.color = "red";
    return;
  }

  if (student.redeemed) {
    status.innerText = "Already Redeemed!";
    status.style.color = "orange";
    return;
  }

  student.redeemed = true;
  saveStudents(students);

  status.innerText = "Food Redeemed Successfully!";
  status.style.color = "green";

  updateAdmin();
}

function updateAdmin() {
  let students = getStudents();
  let redeemed = students.filter(s => s.redeemed).length;

  document.getElementById("totalStudents").innerText = students.length;
  document.getElementById("redeemedCount").innerText = redeemed;
  document.getElementById("foodRemaining").innerText = totalFood - redeemed;
  document.getElementById("footfall").innerText = students.length;
  document.getElementById("seatsAvailable").innerText = totalSeats - students.length;
}