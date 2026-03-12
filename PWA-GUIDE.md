# PWA Installation Guide

## What's Been Added

Your app now has full Progressive Web App (PWA) support with:

1. **Service Worker** - Automatically caches assets for offline use
2. **Web App Manifest** - Defines how the app appears when installed
3. **Install Prompt** - Beautiful in-app prompt to install the app
4. **App Icons** - Placeholder icons (replace with your own designs)
5. **Auto-updates** - Service worker automatically updates when you deploy new versions

## Files Added/Modified

### New Files:
- `src/InstallPrompt.tsx` - Install prompt component
- `public/pwa-192x192.png` - App icon (192x192)
- `public/pwa-512x512.png` - App icon (512x512)
- `public/apple-touch-icon.png` - iOS icon

### Modified Files:
- `vite.config.ts` - Added PWA plugin configuration
- `index.html` - Added PWA meta tags
- `src/App.tsx` - Added InstallPrompt component
- `package.json` - Added vite-plugin-pwa dependency

## How to Test

### Desktop Testing (Easiest):

1. Build the app:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Open the URL in Chrome or Edge

4. You'll see an install prompt at the bottom of the screen, or click the install icon in the address bar

5. Click "Install" to add the app to your desktop

### Mobile Testing:

#### Option 1: Deploy to a server with HTTPS
- Deploy to Vercel, Netlify, or any hosting with HTTPS
- Visit the URL on your mobile device
- Tap the install prompt or use browser's "Add to Home Screen"

#### Option 2: Local network testing
1. Run dev server with host flag:
   ```bash
   npm run dev -- --host
   ```

2. Note your local IP (shown in terminal, e.g., 192.168.1.100)

3. On your mobile device (connected to same WiFi):
   - Visit `http://[your-ip]:3000`
   - Note: Some PWA features require HTTPS

## Customization

### Replace Icons:
The placeholder icons in `/public` should be replaced with your actual app icons:
- Create proper PNG images (not SVG) for better compatibility
- Use tools like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- Or design in Figma/Photoshop and export

### Customize Manifest:
Edit `vite.config.ts` to change:
- App name and short name
- Theme colors
- Display mode (standalone, fullscreen, minimal-ui)
- Orientation (portrait, landscape, any)

### Customize Install Prompt:
Edit `src/InstallPrompt.tsx` to change:
- Appearance and styling
- When to show the prompt
- Dismiss behavior

## PWA Checklist

✅ Service worker configured
✅ Web app manifest created
✅ Icons added (placeholder - replace with real icons)
✅ Theme color set
✅ Install prompt component added
✅ Offline caching enabled
✅ Auto-update configured

## Next Steps

1. **Replace placeholder icons** with professional designs
2. **Test on real devices** - iOS and Android
3. **Deploy to HTTPS server** for full PWA features
4. **Test offline functionality** - disconnect network and reload
5. **Monitor service worker** in DevTools → Application → Service Workers

## Troubleshooting

### Install prompt doesn't show:
- Make sure you're on HTTPS (or localhost)
- Check if app is already installed
- Clear browser data and try again
- Check DevTools Console for errors

### Service worker not registering:
- Build the app first (`npm run build`)
- Use preview mode (`npm run preview`)
- Check DevTools → Application → Service Workers

### Icons not showing:
- Replace SVG placeholders with PNG files
- Ensure icons are in `/public` directory
- Clear cache and rebuild

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
