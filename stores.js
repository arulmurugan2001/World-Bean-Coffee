// ===== Scroll navbar effect =====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

// ===== Stores Data (World Bean Coffee) =====
const STORES = [
  {
    name: "Electronic City",
    address: "3rd Floor, M5 Ecity Mall, Plot No.-1, Hosur Rd, Bangalore, Karnataka 560100",
    lat: 12.8456, lng: 77.6600
  },
  {
    name: "HSR Layout",
    address: "HSR Layout, Sector 2, Bangalore, Karnataka 560102",
    lat: 12.9121, lng: 77.6446
  },
  {
    name: "Indiranagar",
    address: "2984/2, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka 560008",
    lat: 12.9719, lng: 77.6412
  },
  {
    name: "Jayanagar",
    address: "43/1 (Old No : 54), 2nd Main Road, 40th Cross Rd, 8th Block, Jayanagar, Bangalore, Karnataka 560082",
    lat: 12.9250, lng: 77.5938
  },
  {
    name: "Kammanahalli",
    address: "VN Heights, 5M-436, 5th Main Rd, Opp. Kailash Parbat, HRBR Layout, Bengaluru, Karnataka 560043",
    lat: 13.0157, lng: 77.6409
  },
  {
    name: "Koramangala",
    address: "28, 80 Feet Rd, S.T. Bed, Cauvery Colony, Bangalore, Karnataka 560034",
    lat: 12.9352, lng: 77.6245
  },
  {
    name: "Rajarajeshwari Nagar",
    address: "244/1, Ygr Signature Mall, Halagevaderahalli, Bangalore, Karnataka 560098",
    lat: 12.9135, lng: 77.5196
  }
];

const listEl = document.getElementById("storesList");
const searchEl = document.getElementById("storeSearch");

// Map init (Bengaluru center)
const map = L.map("map", { scrollWheelZoom: true }).setView([12.9716, 77.5946], 11);

// OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const markers = [];
let activeIndex = -1;

// Create markers
STORES.forEach((s, idx) => {
  const m = L.marker([s.lat, s.lng]).addTo(map);
  m.bindPopup(`<b>${s.name}</b><br>${s.address}`);
  m.on("click", () => setActive(idx, true));
  markers.push(m);
});

// Render list
function renderList(items){
  listEl.innerHTML = "";
  items.forEach(({store, index}) => {
    const div = document.createElement("div");
    div.className = "store-item" + (index === activeIndex ? " active" : "");
    div.innerHTML = `
      <div class="store-name">${store.name}</div>
      <div class="store-address">${store.address}</div>
    `;
    div.addEventListener("click", () => setActive(index, true));
    listEl.appendChild(div);
  });
}

function setActive(index, openPopup){
  activeIndex = index;

  const q = (searchEl.value || "").trim().toLowerCase();
  const filtered = STORES
    .map((store, i) => ({store, index: i}))
    .filter(x => x.store.name.toLowerCase().includes(q) || x.store.address.toLowerCase().includes(q));

  renderList(filtered);

  const s = STORES[index];
  map.setView([s.lat, s.lng], 14, { animate: true });

  if (openPopup) markers[index].openPopup();
}

// Search filter
searchEl.addEventListener("input", () => {
  const q = searchEl.value.trim().toLowerCase();
  const filtered = STORES
    .map((store, i) => ({store, index: i}))
    .filter(x => x.store.name.toLowerCase().includes(q) || x.store.address.toLowerCase().includes(q));
  renderList(filtered);
});

// initial render + select first
renderList(STORES.map((store, i) => ({store, index: i})));
setActive(0, false);