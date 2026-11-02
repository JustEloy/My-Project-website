/* ==========================================
   ALFRED AUTOMOTIVE
   AVATAR SCROLLING FIX
========================================== */

(function () {
    "use strict";

    function initializeAvatar() {
        const avatar = document.getElementById("profileAvatar");
        const hero = document.querySelector(".hero");
        const heroName = document.querySelector(".hero-name");

        if (!avatar || !hero || !heroName) return;

        // Move the existing avatar into the hero section.
        // Existing click listeners remain attached.
        if (avatar.parentElement !== hero) {
            hero.appendChild(avatar);
        }

        function positionAvatar() {
            const heroRect = hero.getBoundingClientRect();
            const nameRect = heroName.getBoundingClientRect();
            const top = nameRect.top - heroRect.top;

            avatar.style.setProperty("position", "absolute", "important");
            avatar.style.setProperty(
                "top",
                Math.max(24, top) + "px",
                "important"
            );
            avatar.style.setProperty("right", "5%", "important");
            avatar.style.setProperty("bottom", "auto", "important");
            avatar.style.setProperty("left", "auto", "important");
            avatar.style.setProperty("transform", "none", "important");
            avatar.style.setProperty("z-index", "1000", "important");
        }

        positionAvatar();

        window.addEventListener("resize", positionAvatar);
        window.addEventListener("load", positionAvatar);
        window.setTimeout(positionAvatar, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeAvatar
        );
    } else {
        initializeAvatar();
    }
})();