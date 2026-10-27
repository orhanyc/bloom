
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

const BYPASS_MINUTES = 5;

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const site = normalizeDomain(location.hostname);
    let bypassTimer: ReturnType<typeof setTimeout> | undefined;
    let blocked = false;
    let siteEnabled = false;

    const ui = await createShadowRootUi(ctx, {
      name: 'bloom-screen-blocker',
      position: 'modal',
      zIndex: 2147483647,
      css: `
        :host {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 2147483647 !important;
        }
      `,

      onMount: (container) => {
        const root = ReactDOM.createRoot(container);

        root.render(
          <React.StrictMode>
            <ScreenBlocker onContinue={handleContinue} />
          </React.StrictMode>
        );

        return root;
      },

      onRemove: (root) => {
        root?.unmount();
      },
    });

    function block() {
      if (!siteEnabled || blocked) return;

      blocked = true;

      document.querySelectorAll('video').forEach((video) => {
        video.pause();
      });

      ui.mount();
    }

    function allowUntil(expiresAt: number) {
      blocked = false;
      ui.remove();

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
      const { bypasses = {}, bypassCount = 0 } =
        await browser.storage.local.get([
          'bypasses',
          'bypassCount',
        ]);

      const expiresAt = Date.now() + BYPASS_MINUTES * 60 * 1000;

      await browser.storage.local.set({
        bypasses: {
          ...(bypasses as Record<string, number>),
          [site]: expiresAt,
        },
        bypassCount: (bypassCount as number) + 1,
      });

      allowUntil(expiresAt);
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
        return;
      }

      const { bypasses = {} } = await browser.storage.local.get('bypasses');
      const expiresAt = (bypasses as Record<string, number>)[site] ?? 0;

      if (expiresAt > Date.now()) {
        allowUntil(expiresAt);
      } else {
        block();
      }
    }

    await refreshBlockState();

    ctx.onInvalidated(() => {
      if (bypassTimer) {
        clearTimeout(bypassTimer);
      }

      document.removeEventListener('play', handlePlay, true);
      browser.storage.onChanged.removeListener(handleStorageChange);
    });
  },
});
