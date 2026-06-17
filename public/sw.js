// Tells browser that I (the new SW) should take over immediately
import { register } from "next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup";
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

// Serve JS and CSS files immediately while also fetching a fresh
// copy in the background and update the cache
registerRoute(
    ({ request }) =>
        request.destination === "script" || request.destination === "style",
    new StaleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    }),
);

// For images: Check cache first, only update from network if there's no cache
registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
        cacheName: "images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: 60 * 24 * 60 * 60,
            }),
        ],
    }),
);

// For APIs: If network is slow, get cached response
registerRoute(
    ({ url }) => url.pathname.startsWith("/api/"),
    new NetworkFirst({
        cacheName: "api-responses",
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }),
        ],
    }),
);

// CacheFirst for any requests to a different domain
registerRoute(
    ({ url }) => url.origin !== location.origin,
    new CacheFirst({
        cacheName: "external-resources",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    }),
);
