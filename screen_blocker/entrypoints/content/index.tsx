
import React from 'react';
import ReactDOM from 'react-dom/client';
import ScreenBlocker from './ScreenBlocker';
import './ScreenBlocker.css';

const SITE = 'youtube.com';
const BYPASS_MINUTES = 5;

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    let bypassTimer: ReturnType<typeof setTimeout> | undefined;
    let blocked = false;

    const ui = await createShadowRootUi(ctx, {
      name: 'bloom-screen-blocker',
      position: 'modal',
      zIndex: 2147483647,

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
      if (blocked) return;

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
          [SITE]: expiresAt,
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

    const handleStorageChange = (
      changes: Record<
        string,
        { newValue?: unknown; oldValue?: unknown }
      >,
      area: string
    ) => {
      if (area !== 'local' || !changes.bypasses) return;

      const bypasses = changes.bypasses.newValue as
        | Record<string, number>
        | undefined;

      const expiresAt = bypasses?.[SITE] ?? 0;

      if (expiresAt > Date.now()) {
        allowUntil(expiresAt);
      } else {
        if (bypassTimer) {
          clearTimeout(bypassTimer);
          bypassTimer = undefined;
        }

        block();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    const { bypasses = {} } =
      await browser.storage.local.get('bypasses');

    const expiresAt =
      (bypasses as Record<string, number>)[SITE] ?? 0;

    if (expiresAt > Date.now()) {
      allowUntil(expiresAt);
    } else {
      block();
    }

    ctx.onInvalidated(() => {
      if (bypassTimer) {
        clearTimeout(bypassTimer);
      }

      document.removeEventListener('play', handlePlay, true);
      browser.storage.onChanged.removeListener(handleStorageChange);
    });
  },
});
