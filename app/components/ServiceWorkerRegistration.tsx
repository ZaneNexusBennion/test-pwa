"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) {
            console.log("Service Workers not supported");
            return;
        }
        const registerServiceWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register(
                    "/sw.js",
                    { scope: "/" },
                );
                console.log("✅ SW registered:", registration);
            } catch (error) {
                console.error("❌ SW registration failed:", error);
            }
        };
        registerServiceWorker();
    }, []);
    return null;
}
