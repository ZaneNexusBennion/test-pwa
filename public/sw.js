importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js",
);

const { clientsClaim } = workbox.core;
const { ExpirationPlugin } = workbox.expiration;
const { registerRoute, NavigationRoute } = workbox.routing;
const { StaleWhileRevalidate, NetworkFirst, CacheFirst } = workbox.strategies;

clientsClaim();

// ==============================================================================
// AUTO-DETECT ENVIRONMENT
// ==============================================================================
// Check if we're in development by looking at the URL
// In development: localhost, 127.0.0.1, or 0.0.0.0
// In production: your actual domain

const isDevelopment =
    self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1" ||
    self.location.hostname === "0.0.0.0";

console.log(
    `[SW] Running in ${isDevelopment ? "DEVELOPMENT" : "PRODUCTION"} mode`,
);

// ==============================================================================
// APP SHELL STRATEGY (Navigation)
// Only cache pages in production, not in development
// ==============================================================================

if (!isDevelopment) {
    console.log("[SW] Navigation caching enabled (production mode)");

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
            allowlist: [/^\/(?!api\/).*$/],
            denylist: [/\.map$/, /hot-update/],
        },
    );

    registerRoute(appShellRoute);
} else {
    console.log("[SW] Navigation caching disabled (development mode)");
}

// ==============================================================================
// STATIC ASSETS (JS & CSS) - Always cache, safe in both dev and prod
// ==============================================================================

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

// ==============================================================================
// IMAGES
// ==============================================================================

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

// ==============================================================================
// API ROUTES - Use NetworkFirst with short timeout
// ==============================================================================

registerRoute(
    ({ url }) => url.pathname.startsWith("/api/"),
    new NetworkFirst({
        cacheName: "api-responses",
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
            }),
        ],
    }),
);

// ==============================================================================
// EXTERNAL RESOURCES (Google Fonts, CDNs)
// ==============================================================================

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

console.log("[SW] Service worker initialized successfully");
