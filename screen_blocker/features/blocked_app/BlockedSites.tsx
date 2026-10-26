import { useEffect, useState } from 'react';
import { getBlockedSites, saveBlockedSites, type BlockedSite } from './storage';
import './BlockedSites.css';

function formatSiteName(domain: string) {
  return domain
    .split('.')
    .map((part) => part.toLowerCase())
    .join('.');
}

function BlockedSites() {
  const [sites, setSites] = useState<BlockedSite[]>([]);
  const [newSite, setNewSite] = useState('');

  useEffect(() => {
    getBlockedSites().then(setSites);
  }, []);

  function updateSites(nextSites: BlockedSite[]) {
    // Save every change so settings survive browser restarts.
    setSites(nextSites);
    saveBlockedSites(nextSites);
  }

  function toggleSite(domain: string) {
    updateSites(
      sites.map((site) =>
        site.domain === domain ? { ...site, enabled: !site.enabled } : site,
      ),
    );
  }

  function addSite() {
    const domain = newSite.trim().toLowerCase().replace(/^https?:\/\//, '');

    if (!domain || sites.some((site) => site.domain === domain)) return;

    updateSites([...sites, { domain, enabled: true }]);
    setNewSite('');
  }

  function removeSite(domain: string) {
    updateSites(sites.filter((site) => site.domain !== domain));
  }

  return (
    <main className="blocked-sites">
      <h1>Blocked sites</h1>
      <p>Bloom steps in when you open these sites.</p>

      <section className="site-list">
        {sites.map((site) => (
          <div className="site-row" key={site.domain}>
            <span>{formatSiteName(site.domain)}</span>
            <button onClick={() => toggleSite(site.domain)}>
              {site.enabled ? 'On' : 'Off'}
            </button>
            <button className="remove" onClick={() => removeSite(site.domain)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="add-site">
        <input
          value={newSite}
          onChange={(event) => setNewSite(event.target.value)}
          placeholder="e.g. pinterest.com"
        />
        <button onClick={addSite}>Add site</button>
      </section>
    </main>
  );
}

export default BlockedSites;
