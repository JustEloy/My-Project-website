
/* ==========================================
   ALFRED AUTOMOTIVE
   GOOGLE ANALYTICS
========================================== */

import { app } from "./firebase-config.js";

import {
    getAnalytics,
    isSupported,
    logEvent
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

async function trackPageView() {
    try {
        if (!(await isSupported())) {
            console.info("Analytics is not supported in this browser.");
            return;
        }

        const analytics = getAnalytics(app);

        const pageName =
            document.body.dataset.page ||
            window.location.pathname.split("/").pop() ||
            "index.html";

        logEvent(analytics, "portfolio_page_loaded", {
            page_name: pageName,
            page_location: window.location.href
        });

        console.info("Page visit sent to Firebase Analytics.");
    } catch (error) {
        console.error("Analytics error:", error);
    }
}

trackPageView();
