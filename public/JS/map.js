  
  
  const lat = listing.geometry.coordinates[1]
  const lng = listing.geometry.coordinates[0]

  const map = L.map('map',{
    zoomControl: true,        // disable + and - buttons
    scrollWheelZoom: true,    // disable mouse wheel zoom
    doubleClickZoom: true,    // disable double click zoom
    touchZoom: true,          // disable touch zoom
    dragging: true,             // optional: allow dragging (set false to disable)
  }).setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  const customIcon = L.icon({
    // className: "circle-marker",
    // html: `<img src="/images/HomeNear_logo2.png" class="circle-img">`,
    iconUrl: '/images/HomeNear_Logo.png',  //path to your logo
    iconSize: [50, 50],           // size of the icon
    iconAnchor: [25, 50],         // point of the icon which corresponds to marker's location
    popupAnchor: [0, -50]         // popup position relative to icon
  });

  L.marker([lat, lng], { icon: customIcon }).addTo(map)
    .bindPopup(`${listing.title}<br><p>Exact location will be provided after booking</p>`)
    .openPopup();