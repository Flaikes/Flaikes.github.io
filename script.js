async function loadSites() {
  const container = document.getElementById('dashboard');
  const timestamp = document.getElementById('timestamp');
  try {
    const res = await fetch('sites.json');
    const sites = await res.json();

    sites.forEach(site => {
      const card = document.createElement('div');
      card.className = 'site-card text-center';

      const dot = document.createElement('span');
      dot.className = 'status-dot';
      card.appendChild(dot);

      const img = document.createElement('img');
      img.src = site.logo;
      img.alt = site.name;
      card.appendChild(img);

      const link = document.createElement('a');
      link.href = site.url;
      link.target = '_blank';
      link.textContent = site.name;
      card.appendChild(link);

      container.appendChild(card);

      checkStatus(site.url, dot);
    });

    timestamp.textContent = new Date().toLocaleString();
  } catch (err) {
    container.innerHTML = `<p>Failed to load sites.json 😢</p>`;
    console.error(err);
  }
}

async function checkStatus(url, dot) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeout);
    dot.classList.add('online');
    dot.title = 'Online';
  } catch (e) {
    dot.classList.add('offline');
    dot.title = 'Offline';
  }
}

loadSites();
