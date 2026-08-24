// ---- State ----
let totalBookings = 0;
let completedCount = 0;
let cancelledCount = 0;
let bookings = []; // { id, route, departure, driver }
let bookingIdSeq = 1;

// ---- DOM refs ----
const totalEl = document.getElementById('totalCount');
const completedEl = document.getElementById('completedCount');
const cancelledEl = document.getElementById('cancelledCount');
const statusMsg = document.getElementById('statusMsg');
const rideResult = document.getElementById('rideResult');
const bookingsBody = document.getElementById('bookingsBody');
const searchBtn = document.getElementById('searchBtn');
const bookBtn = document.getElementById('bookBtn');
const pickupSel = document.getElementById('pickup');
const destSel = document.getElementById('destination');

function renderStats(){
  totalEl.textContent = totalBookings;
  completedEl.textContent = completedCount;
  cancelledEl.textContent = cancelledCount;
}

function renderBookings(){
  bookingsBody.innerHTML = '';
  if(bookings.length === 0){
    bookingsBody.innerHTML = '<tr class="empty-row"><td colspan="4">No bookings yet.</td></tr>';
    return;
  }
  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.dataset.id = b.id;
    tr.innerHTML = `
      <td class="route-cell">${b.route}</td>
      <td>${b.departure}</td>
      <td>${b.driver}</td>
      <td><button class="cancel-btn" data-id="${b.id}">Cancel</button></td>
    `;
    bookingsBody.appendChild(tr);
  });
}

function showStatus(text){
  statusMsg.textContent = text;
  statusMsg.style.display = 'block';
  // auto-hide after a few seconds, like a toast-ish confirmation
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(() => { statusMsg.style.display = 'none'; }, 3000);
}

// Step 2: Search available rides
searchBtn.addEventListener('click', () => {
  statusMsg.style.display = 'none';
  rideResult.style.display = 'block';
});

// Step 3: Book a ride
bookBtn.addEventListener('click', () => {
  const booking = {
    id: bookingIdSeq++,
    route: 'Origin → Destination',
    departure: '31-July-2026, 8:48 am',
    driver: 'Ali'
  };
  bookings.push(booking);
  totalBookings++;

  renderStats();
  renderBookings();

  rideResult.style.display = 'none';
  showStatus('Ride Booked!');
});

// Step 4: Cancel a booking (event delegation on the table)
bookingsBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.cancel-btn');
  if(!btn) return;

  const id = Number(btn.dataset.id);
  bookings = bookings.filter(b => b.id !== id);

  totalBookings = Math.max(0, totalBookings - 1);
  cancelledCount++;

  renderStats();
  renderBookings();
  showStatus('Ride Cancelled!');
});

// Initial render
renderStats();
renderBookings();
