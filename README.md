<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/aa45250f-36d7-4522-bd91-d10a2d2345f1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## PWA Features

This app now supports Progressive Web App (PWA) installation!

### Features:
- Install to home screen on mobile and desktop
- Offline functionality with service worker
- Fast loading with intelligent caching
- Native app-like experience
- Auto-updates when new versions are available

### Testing PWA Installation

#### On Desktop (Chrome/Edge):
1. Build and preview: `npm run build && npm run preview`
2. Open the preview URL in Chrome/Edge
3. Look for the install icon in the address bar or the install prompt at the bottom
4. Click to install the app to your desktop

#### On Mobile:
1. Deploy the built app to a server with HTTPS (required for PWA)
2. Visit the URL on your mobile device
3. You'll see an "Add to Home Screen" prompt
4. Tap to install and use like a native app

#### Testing Locally on Mobile:
1. Run: `npm run dev -- --host`
2. Find your local IP address (shown in terminal)
3. Visit `http://[your-ip]:3000` on your mobile device
4. Note: Full PWA features require HTTPS in production

### Build for Production

```bash
npm run build
```

The PWA service worker and manifest will be automatically generated during the build process.
