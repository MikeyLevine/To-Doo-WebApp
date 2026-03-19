// calendar.js — calendar render + event logic
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentView = 'tasks'; // 'tasks' or 'calendar'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

async function loadEvents() {
  try {
    return await apiGetEvents(currentYear, currentMonth + 1);
  } catch (err) {
    console.error('Failed to load events:', err.message);
    return [];
  }
}

async function renderCalendarGrid() {
  const grid = document.getElementById('calendar-grid');
  const header = document.getElementById('calendar-header');
  
  if (!grid || !header) return;

  header.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  
  const events = await loadEvents();
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let html = '<div class="calendar-day-names"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div>';
  html += '<div class="calendar-days">';
  
  // Empty cells for days before the first of the month
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const hasEvents = dayEvents.length > 0;
    
    html += `<div class="calendar-day" data-date="${dateStr}" onclick="showDayPanel('${dateStr}')">
      <span class="day-number">${day}</span>`;
    
    if (hasEvents) {
      html += '<div class="event-dots">';
      dayEvents.forEach(e => {
        html += `<span class="event-dot" style="background:${e.color}"></span>`;
      });
      html += '</div>';
    }
    
    html += '</div>';
  }
  
  html += '</div>';
  grid.innerHTML = html;
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendarGrid();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendarGrid();
}

async function showDayPanel(dateStr) {
  const panel = document.getElementById('day-panel');
  const title = document.getElementById('day-panel-title');
  const list = document.getElementById('day-events-list');
  
  if (!panel) return;
  
  const date = new Date(dateStr);
  title.textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const events = await apiGetEvents(currentYear, currentMonth + 1);
  const dayEvents = events.filter(e => e.date === dateStr);
  
  list.innerHTML = '';
  dayEvents.forEach(event => {
    const item = document.createElement('div');
    item.className = 'day-event-item';
    item.style.borderLeftColor = event.color;
    item.innerHTML = `
      <span>${event.title}</span>
      <button class="delete-event-btn" onclick="deleteEvent(${event.id})">✕</button>
    `;
    list.appendChild(item);
  });
  
  if (dayEvents.length === 0) {
    list.innerHTML = '<p class="no-events">No events</p>';
  }
  
  panel.style.display = 'block';
  document.getElementById('event-date-input').value = dateStr;
}

function hideDayPanel() {
  document.getElementById('day-panel').style.display = 'none';
}

async function createEvent() {
  const title = document.getElementById('event-title-input').value.trim();
  const date = document.getElementById('event-date-input').value;
  const color = document.getElementById('event-color-input').value;
  
  if (!title || !date) return;
  
  try {
    await apiCreateEvent(title, date, color, '');
    document.getElementById('event-title-input').value = '';
    showDayPanel(date);
    renderCalendarGrid();
  } catch (err) {
    console.error('Failed to create event:', err.message);
  }
}

async function deleteEvent(id) {
  try {
    await apiDeleteEvent(id);
    const date = document.getElementById('event-date-input').value;
    showDayPanel(date);
    renderCalendarGrid();
  } catch (err) {
    console.error('Failed to delete event:', err.message);
  }
}

function showCalendarView() {
  currentView = 'calendar';
  document.getElementById('todo-section').style.display = 'none';
  document.getElementById('calendar-section').style.display = 'block';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
  document.getElementById('tab-calendar').classList.add('active-tab');
  renderCalendarGrid();
}

function showTasksView() {
  currentView = 'tasks';
  document.getElementById('calendar-section').style.display = 'none';
  document.getElementById('todo-section').style.display = 'block';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
  document.getElementById('tab-tasks').classList.add('active-tab');
}
