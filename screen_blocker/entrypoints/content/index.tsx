import React from 'react';
import ReactDOM from 'react-dom/client';
import ScreenBlocker from './ScreenBlocker';
import './ScreenBlocker.css'

export default defineContentScript({
    //Blocked Sites
    matches: ['*://*.youtube.com/*'],
    cssInjectionMode:'ui',
    async main(ctx){
        const ui = await createShadowRootUi(ctx, {
            name: 'bloom-screen-blocker',
            position: 'modal',
            zIndex: 2147483647,
            onMount: (container) => {
                const root = ReactDOM.createRoot(container);
                root.render(
                    //Strict mode is for testing cases
                    <React.StrictMode>
                        <ScreenBlocker/>
                    </React.StrictMode>
                );
                return root;
            },
            onRemove:(root) =>{
                root?.unmount()
            }
        });
        ui.mount();
    }
});