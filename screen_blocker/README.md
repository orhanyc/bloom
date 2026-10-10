# Bloom — Internal Development Notes

This folder is the main Chrome extension project. It uses WXT, React, and TypeScript.

## Feature folders

Each feature has its own folder under `features/`:

```text
features/
├── blocked_app/
├── screenblocker/
├── social_media/
├── interactive_activity/
├── flower_growth/
└── flower_display/
```

The folders contain either the current implementation or a short placeholder README. Keep separate features in their own folders and use shared storage keys when features need to communicate.

## Start the app

From a terminal:

```powershell
cd C:\Users\orhan\Desktop\bloom\screen_blocker
npm install
npm run dev
```

To load it in Chrome:

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select `screen_blocker/.output/chrome-mv3-dev`.

Reload the extension after code changes.

## Before committing

Run these commands from `screen_blocker`:

```powershell
npm run compile
npm run build
git status
```

Make sure the checks pass and that every file shown by `git status` is expected.

## Branch and push rules

Work on a feature branch instead of directly on `main`.

```powershell
git switch <feature-branch>
git pull --rebase origin <feature-branch>
```

After checking the changes:

```powershell
git add <files-for-your-feature>
git commit -m "Describe the change"
git push origin <feature-branch>
```

The `main` branch is protected by the repository ruleset. Changes should go through a pull request, and required checks/review must pass before merging.

## Useful commands

```powershell
git status
git branch -a
git log --oneline --decorate -10
git diff
```

To bring the latest `main` changes into a feature branch:

```powershell
git fetch origin
git switch <feature-branch>
git merge origin/main
```

If there is a conflict, resolve it, run the checks again, commit the merge, and push the branch. Contact Orhan, if needed.

Generated folders such as `node_modules`, `.output`, and `.wxt` are ignored and should not be committed.
