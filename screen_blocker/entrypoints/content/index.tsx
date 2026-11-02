import React from 'react';
import ReactDOM from 'react-dom/client';
import ScreenBlocker from './ScreenBlocker';
import './ScreenBlocker.css';
import {
  domainMatches,
  getBlockedSites,
  normalizeDomain,
  type BlockedSite,
} from '../../features/blocked_app/storage';
import {
  getBypassExpiry,
  startBypass,
} from '../../features/social_media/bypass';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  cssInjectionMode: 'ui',

  async main(ctx) {
    const site = normalizeDomain(location.hostname);
    const pageRoot = document.documentElement;
    const pageCover = document.createElement('style');
    pageCover.textContent = `
      html[data-bloom-covered] {
        background: #f6f4ec !important;
      }
      html[data-bloom-covered] > body {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    pageRoot.append(pageCover);
    pageRoot.setAttribute('data-bloom-covered', '');

    function revealPage() {
      pageRoot.removeAttribute('data-bloom-covered');
    }

    ctx.onInvalidated(() => {
      revealPage();
      pageCover.remove();
    });

    let bypassTimer: ReturnType<typeof setTimeout> | undefined;
    let blocked = false;
    let siteEnabled = false;

    //creates the root cover for the screen
    const ui = await createShadowRootUi(ctx, {
      name: 'bloom-screen-blocker',
      anchor: 'html',
      //position allows blocker to block screen dynamically
      position: 'modal',
      //forces the blocker to be the very top priority on the website
      css: `
        :host {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 2147483647 !important;
          display: block !important;
        }
      `,

      //Adds the screenblocker to webpage when .mount() is called
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <ScreenBlocker site={site} onContinue={handleContinue} />
        );
        return root;
      },

      //Removes the screenblocker from webpage when .unmount() is called
      onRemove: (root) => {
        root?.unmount();
      },
    }).catch((error) => {
      revealPage();
      pageCover.remove();
      throw error;
    });

    function block() {
      if (!siteEnabled || blocked) return;

      pageRoot.setAttribute('data-bloom-covered', '');
      blocked = true;

      document.querySelectorAll('video').forEach((video) => {
        video.pause();
      });

      ui.mount();
    }

    function allowUntil(expiresAt: number) {
      blocked = false;
      ui.remove();
      revealPage();

      if (bypassTimer) {
        clearTimeout(bypassTimer);
      }

      const remainingTime = expiresAt - Date.now();

      if (remainingTime <= 0) {
        block();
        return;
      }

      bypassTimer = setTimeout(() => {
        block();
      }, remainingTime);
    }

    async function handleContinue() {
      allowUntil(await startBypass(site));
    }

    const handlePlay = (event: Event) => {
      if (
        blocked &&
        event.target instanceof HTMLMediaElement
      ) {
        event.target.pause();
      }
    };

    document.addEventListener('play', handlePlay, true);

    const handleStorageChange = async (
      changes: Record<
        string,
        { newValue?: unknown; oldValue?: unknown }
      >,
      area: string
    ) => {
      if (area !== 'local') return;

      if (changes.blockedSites) {
        await refreshBlockState(changes.blockedSites.newValue as BlockedSite[] | undefined);
        return;
      }

      if (changes.bypasses) {
        await refreshBlockState();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    async function refreshBlockState(sites?: BlockedSite[]) {
      const blockedSites = sites ?? (await getBlockedSites());
      siteEnabled = blockedSites.some(
        (blockedSite) =>
          blockedSite.enabled && domainMatches(site, blockedSite.domain),
      );

      if (!siteEnabled) {
        if (bypassTimer) {
          clearTimeout(bypassTimer);
          bypassTimer = undefined;
        }
        blocked = false;
        ui.remove();
        revealPage();
        return;
      }

      pageRoot.setAttribute('data-bloom-covered', '');
      const expiresAt = await getBypassExpiry(site);

      if (expiresAt > Date.now()) {
        allowUntil(expiresAt);
      } else {
        block();
      }
    }

    await refreshBlockState().catch((error) => {
      revealPage();
      throw error;
    });

    ctx.onInvalidated(() => {
      if (bypassTimer) {
        clearTimeout(bypassTimer);
      }

      document.removeEventListener('play', handlePlay, true);
      browser.storage.onChanged.removeListener(handleStorageChange);
    });
  },
});
