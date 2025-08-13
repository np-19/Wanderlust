  const map = L.map('map').setView([lat, lng], 20);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const marker = L.marker([lat, lng]).addTo(map);
marker.bindPopup(`<b>${title}</b><br> ${address}.`).openPopup();