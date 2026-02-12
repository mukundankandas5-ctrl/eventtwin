const events = [
  { name: "AI Hackathon", fee: 200, details: "24hr coding competition" },
  { name: "Tech Quiz", fee: 100, details: "Technical MCQ battle" },
  { name: "Startup Pitch", fee: 300, details: "Pitch your startup idea" },
  { name: "Cultural Night", fee: 150, details: "Dance & music competition" },
  { name: "Gaming Tournament", fee: 250, details: "Competitive esports event" }
];

if(document.getElementById("eventSelect")){
  const select = document.getElementById("eventSelect");
  events.forEach((e,i)=>{
    let option = document.createElement("option");
    option.value = i;
    option.text = e.name + " - ₹" + e.fee;
    select.add(option);
  });
}

function showEventDetails(){
  let idx = document.getElementById("eventSelect").value;
  if(idx==="") return;
  let e = events[idx];
  document.getElementById("eventDetails").innerHTML =
    `<b>${e.name}</b><br>${e.details}<br>Fee: ₹${e.fee}`;
}

function proceedPayment(){
  let name = document.getElementById("name").value;
  let college = document.getElementById("college").value;
  let dept = document.getElementById("dept").value;
  let idx = document.getElementById("eventSelect").value;

  if(!name || !college || !dept || idx===""){
    alert("Fill all fields");
    return;
  }

  alert("Redirecting to Razorpay...");
  setTimeout(()=>{
    completeRegistration(name,college,dept,events[idx].name);
  },1000);
}

function completeRegistration(name,college,dept,eventName){
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let id = "EVT"+Date.now();

  students.push({
    id,name,college,dept,event:eventName,
    redeemed:false,
    loggedIn:true
  });

  localStorage.setItem("students",JSON.stringify(students));

  document.querySelector(".card").style.display="none";
  document.getElementById("qrSection").classList.remove("hidden");

  let wrist = document.getElementById("wristband");
  wrist.innerHTML = `<h3>${name}</h3><p>${eventName}</p><p>ID: ${id}</p><div id="qr"></div>`;
  new QRCode(document.getElementById("qr"), id);
}

function joinWhatsApp(){
  window.open("https://chat.whatsapp.com/examplelink","_blank");
}

function redeemFood(){
  let id = document.getElementById("scanId").value;
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let s = students.find(st=>st.id===id);
  let status = document.getElementById("scanStatus");

  if(!s){
    status.innerHTML="Invalid QR";
    status.style.color="red";
    return;
  }

  if(s.redeemed){
    status.innerHTML="Already Redeemed";
    status.style.color="orange";
    return;
  }

  s.redeemed=true;
  localStorage.setItem("students",JSON.stringify(students));
  status.innerHTML="Redeemed Successfully";
  status.style.color="green";
}

function loadAdmin(){
  let students = JSON.parse(localStorage.getItem("students")) || [];

  document.getElementById("totalReg").innerText = students.length;
  document.getElementById("loggedIn").innerText = students.filter(s=>s.loggedIn).length;
  document.getElementById("redeemed").innerText = students.filter(s=>s.redeemed).length;
  document.getElementById("footfall").innerText = students.length;

  let table = document.getElementById("studentTable");
  students.forEach(s=>{
    let row = table.insertRow();
    row.insertCell(0).innerText=s.name;
    row.insertCell(1).innerText=s.college;
    row.insertCell(2).innerText=s.dept;
    row.insertCell(3).innerText=s.event;
    row.insertCell(4).innerText=s.redeemed?"Yes":"No";
  });
}