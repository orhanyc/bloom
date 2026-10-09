/*
Runs in the background
This is the Service Worker

Listen for browser-level events
manage global state
No DOM access 
*/

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  //browser.tabs.onActivated.addListener(async (activeInfo) => {});
});