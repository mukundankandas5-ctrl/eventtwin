let events = [];

function predictAttendance(type, registrations) {
  let ratio = 0.75;
  if (type === "Technical") ratio = 0.7;
  if (type === "Cultural") ratio = 0.85;
  if (type === "Workshop") ratio = 0.6;

  return Math.round(registrations * ratio);
}

function createEvent() {
  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const capacity = parseInt(document.getElementById("capacity").value);
  const type = document.getElementById("type").value;

  if (!title || !date || !time || !capacity) {
    alert("Please fill all fields");
    return;
  }

  const clash = events.some(e => e.date === date && e.time === time);

  const newEvent = {
    title,
    date,
    time,
    capacity,
    type,
    registrations: 0
  };

  events.push(newEvent);

  if (clash) {
    alert("🚨 Event Clash Detected at same time!");
  }

  renderEvents();
}

function register(index) {
  events[index].registrations++;
  renderEvents();
}

function renderEvents() {
  const container = document.getElementById("events");
  container.innerHTML = "";

  events.forEach((event, index) => {
    const predicted = predictAttendance(event.type, event.registrations);
    const healthScore = Math.round((event.registrations / event.capacity) * 100);

    let healthClass = "green";
    let healthText = "Healthy";

    if (healthScore < 50) {
      healthClass = "red";
      healthText = "Critical";
    } else if (healthScore < 80) {
      healthClass = "yellow";
      healthText = "Moderate";
    }

    container.innerHTML += `
      <div class="event-card">
        <h3>${event.title}</h3>
        <p>Date: ${event.date} | Time: ${event.time}</p>
        <p>Type: ${event.type}</p>
        <p>Registrations: ${event.registrations}</p>
        <p>🔮 Predicted Attendance: ${predicted}</p>
        <p class="${healthClass}">📊 Health Score: ${healthScore}% (${healthText})</p>
        <button onclick="register(${index})">Register</button>
      </div>
    `;
  });
}