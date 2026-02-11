let events = [
  {
    title: "AI Workshop 2026",
    date: "2026-03-15",
    time: "10:00",
    capacity: 100,
    type: "Workshop",
    registrations: 40
  },
  {
    title: "Tech Symposium",
    date: "2026-03-16",
    time: "11:00",
    capacity: 200,
    type: "Technical",
    registrations: 120
  }
];

let myRegistrations = [];

/* ROLE SYSTEM */
function selectRole(role) {
  document.getElementById("roleSelection").classList.add("hidden");
  if (role === "organizer") {
    document.getElementById("organizerDashboard").classList.remove("hidden");
    renderEvents();
  } else {
    document.getElementById("participantDashboard").classList.remove("hidden");
    renderParticipantEvents();
  }
}

function logout() {
  document.getElementById("organizerDashboard").classList.add("hidden");
  document.getElementById("participantDashboard").classList.add("hidden");
  document.getElementById("roleSelection").classList.remove("hidden");
}

/* AI LOGIC */
function predictAttendance(type, registrations) {
  let ratio = 0.75;
  if (type === "Technical") ratio = 0.7;
  if (type === "Cultural") ratio = 0.85;
  if (type === "Workshop") ratio = 0.6;
  return Math.round(registrations * ratio);
}

function sustainabilityScore(registrations) {
  if (registrations > 150) return "High Impact 🌍";
  if (registrations > 70) return "Moderate 🌿";
  return "Low 🌱";
}

function createEvent() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const capacity = parseInt(document.getElementById("capacity").value);
  const type = document.getElementById("type").value;

  if (!title || !date || !time || !capacity) {
    alert("Fill all fields");
    return;
  }

  const clash = events.some(e => e.date === date && e.time === time);
  if (clash) alert("🚨 Event Clash Detected!");

  events.push({ title, date, time, capacity, type, registrations: 0 });
  renderEvents();
}

function register(index) {
  events[index].registrations++;
  myRegistrations.push(events[index]);
  renderEvents();
  renderParticipantEvents();
}

function renderEvents() {
  const container = document.getElementById("events");
  container.innerHTML = "";

  events.forEach((event, index) => {

    const predicted = predictAttendance(event.type, event.registrations);
    const healthScore = Math.min(100, Math.round((event.registrations / event.capacity) * 100));

    let risk = "Low";
    let riskClass = "green";
    if (event.registrations < event.capacity * 0.3) {
      risk = "High Dropout Risk";
      riskClass = "red";
    } else if (event.registrations < event.capacity * 0.6) {
      risk = "Moderate Risk";
      riskClass = "orange";
    }

    let confidence = "High";
    if (event.registrations < 30) confidence = "Low";
    else if (event.registrations < 80) confidence = "Medium";

    let suggestion = "Performance Stable";
    if (predicted > event.capacity)
      suggestion = "Upgrade Venue Capacity";
    else if (event.registrations < event.capacity * 0.4)
      suggestion = "Send Reminder Notification";

    container.innerHTML += `
      <div class="event-card">
        <h3>${event.title}</h3>
        <div class="metric">📅 ${event.date} | ⏰ ${event.time}</div>
        <div class="metric">👥 Registrations: ${event.registrations}</div>
        <div class="metric">🔮 Predicted: ${predicted}</div>
        <div class="metric">🤖 AI Confidence: ${confidence}</div>

        <div class="metric">📊 Health Score: ${healthScore}%</div>
        <div class="progress-bar">
          <div class="progress" style="width:${healthScore}%"></div>
        </div>

        <div class="metric ${riskClass}">📉 Risk: ${risk}</div>
        <div class="metric">🌍 Sustainability: ${sustainabilityScore(event.registrations)}</div>
        <div class="metric">🤖 Suggestion: ${suggestion}</div>

        <button onclick="alert('Smart Reminder Sent Successfully!')">
        Send Reminder
        </button>

        <canvas id="chart${index}" height="100"></canvas>
      </div>
    `;
  });

  setTimeout(drawCharts, 100);
}

function drawCharts() {
  events.forEach((event, index) => {
    const ctx = document.getElementById(`chart${index}`);
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Registered', 'Predicted'],
        datasets: [{
          data: [event.registrations, predictAttendance(event.type, event.registrations)]
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });
  });
}

function renderParticipantEvents() {
  const container = document.getElementById("participantEvents");
  const myContainer = document.getElementById("myEvents");

  container.innerHTML = "";
  myContainer.innerHTML = "";

  events.forEach((event, index) => {
    container.innerHTML += `
      <div class="event-card">
        <h3>${event.title}</h3>
        <div>${event.date} | ${event.time}</div>
        <button onclick="register(${index})">Register</button>
      </div>
    `;
  });

  myRegistrations.forEach(event => {
    myContainer.innerHTML += `
      <div class="event-card">
        <h3>${event.title}</h3>
        <div>Registered ✅</div>
      </div>
    `;
  });
}