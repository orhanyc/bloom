# Bloom

Bloom is a Google Chrome extension designed to help users spend less time mindlessly scrolling through distracting websites such as Instagram, TikTok, YouTube, and Reddit.

Instead of only blocking websites, Bloom encourages users to choose productive alternative activities. Users can track their progress, complete activities, earn points, and grow a virtual flower.

## Features

- Screen blocker for selected websites
- Custom blocked-sites list
- Temporary access through a Continue button
- Interactive alternative activity list
- Flower growth and leveling system
- Progress, streak, and usage tracking
- Flower display case for completed flowers

## Project Structure

```text
bloom/
├── README.md
└── screen_blocker/
    ├── entrypoints/
    ├── features/
    ├── public/
    ├── package.json
    └── wxt.config.ts
```

The Chrome extension source code is located in the `screen_blocker` folder. Feature-specific code is organized inside `screen_blocker/features`.

## Technologies

- React
- TypeScript
- WXT
- Chrome Extension Manifest V3
- Chrome Storage API

## Running the Extension

Open a terminal in the extension folder:

```powershell
cd screen_blocker
npm install
npm run dev
```

Then load the extension in Chrome:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select `screen_blocker/.output/chrome-mv3-dev`.

## Testing the Project

Run the following commands from the `screen_blocker` folder:

```powershell
npm run compile
npm run build
```

The extension should compile and build successfully before changes are submitted.

## Development Workflow

Development should be done on feature branches. Changes to `main` should be submitted through a pull request and reviewed before merging.

Generated folders such as `node_modules`, `.output`, and `.wxt` are ignored and should not be committed.
