// Tells browser that I (the new SW) should take over immediately
import { clientsClaim } from "workbox-core";
// Automatically deletes old cached files (e.g., delete files older than 60 days)
import { ExpirationPlugin } from "workbox-expiration";
// Tools to say "when this request happens, do this"
import { registerRoute, NavigationRoute } from "workbox-routing";
// Different caching strategies
import {
    StaleWhileRevalidate,
    NetworkFirst,
    NetworkOnly,
} from "workbox-strategies";

// Tells service worker to activate immediate and take control of app
clientsClaim();

// When a user navigates to a page, try to get that page from the internet.
// If that fails, fallback on the cached page.
const appShellRoute = new NavigationRoute(
    new NetworkFirst({
        cacheName: "app-shell",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    }),
    {
        // Allow all pages to be cached except for api routes
        allowlist: [/^\/(?!api\/).*$/],
        denylist: [/\.map$/, /hot-update/],
    },
);

registerRoute(appShellRoute);
