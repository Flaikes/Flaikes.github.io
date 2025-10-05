async function loadSites() {
  const container = document.getElementById('dashboard');
  const timestamp = document.getElementById('timestamp');

  try {
    const res = await fetch('sites.json');
    const sites = await res.json();

    sites.forEach(site => {
      const card = document.createElement('div');
      card.className = 'site-card';

      const status = document.createElement('span');
      status.className = 'status checking';
      status.textContent = '…';
      card.appendChild(status);

      const logo = document.createElement('img');
      logo.src = site.logo;
      logo.alt = site.name;
      card.appendChild(logo);

      const title = document.createElement('h3');
      title.textContent = site.name;
      card.appendChild(title);

      card.onclick = () => window.open(site.url, '_blank');
      container.appendChild(card);

      checkStatus(site.url, status);
    });

    timestamp.textContent = new Date().toLocaleString();
  } catch (err) {
    container.innerHTML = `<p>⚠️ Failed to load sites.json</p>`;
    console.error(err);
  }
}

async function checkStatus(url, el) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeout);
    el.textContent = 'Online';
    el.classList.replace('checking', 'online');
  } catch {
    el.textContent = 'Offline';
    el.classList.replace('checking', 'offline');
  }
}

loadSites();
