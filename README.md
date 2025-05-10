# Sales Assistant Chrome Extension

## Description
This Chrome extension uses the Gemini API to identify sales pages and highlight items on sale. It injects DOM elements to visually mark sale items and provides additional information in a tooltip when hovering over them.

## Features
- Detects if the current page is a sales page using the Gemini API.
- Highlights sale items with a light blue border.
- Displays a tooltip with additional information when hovering over sale items.

## Installation
1. Run `npm install` to install dependencies.
2. Build the project using `npm run build`. This will generate the `dist` folder.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable "Developer mode" and load the unpacked extension from the `dist` folder.

## Usage
1. Click the "Scan Page" button in the extension popup to analyze the current page.
2. Sale items will be highlighted with a light blue border.
3. Hover over a sale item to see a tooltip with additional information.

## Development
This project is built using:
- **React** for the UI.
- **TypeScript** for type safety.
- **Vite** for fast builds and development.

### Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Run ESLint to check for code issues.

## Folder Structure
```
sales-assistant/
├── public/             # Static assets (e.g., manifest.json, icons)
├── src/                # Source code
│   ├── App.tsx         # Main React component
│   ├── main.tsx        # Entry point for the React app
│   ├── background.ts   # Background script for the extension
├── dist/               # Production build output
├── package.json        # Project configuration and dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## License
This project is licensed under the MIT License.
