
/* ==========================================
   ALFRED AUTOMOTIVE
   COMPLETE COMBINED MAIN JAVASCRIPT
   FIREBASE CONTACT FORM INTEGRATED
========================================== */


/* ==========================================
   FIREBASE IMPORTS
========================================== */

import { db, auth } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


/* ==========================================
   CAR DATA
========================================== */

const carData = {
    "1": {
        name: "Alfred Apex R",
        status: "Available",
        engine: "3.8L Twin-Turbo V6",
        power: "580 HP",
        zeroToHundred: "3.1 s",
        drivetrain: "AWD",
        fuel: "92%",
        condition: "Excellent",
        topSpeed: 330
    },
    "2": {
        name: "Alfred Storm GT",
        status: "Reserved",
        engine: "4.0L Twin-Turbo V8",
        power: "620 HP",
        zeroToHundred: "3.3 s",
        drivetrain: "RWD",
        fuel: "78%",
        condition: "Very Good",
        topSpeed: 318
    },
    "3": {
        name: "Alfred Phantom X",
        status: "Available",
        engine: "5.2L V10",
        power: "640 HP",
        zeroToHundred: "3.4 s",
        drivetrain: "AWD",
        fuel: "85%",
        condition: "Excellent",
        topSpeed: 305
    },
    "4": {
        name: "Alfred Blaze S",
        status: "In Service",
        engine: "2.0L Turbo I4",
        power: "350 HP",
        zeroToHundred: "4.2 s",
        drivetrain: "FWD",
        fuel: "64%",
        condition: "Good",
        topSpeed: 292
    },
    "5": {
        name: "Alfred Titan RS",
        status: "Available",
        engine: "3.0L Twin-Turbo I6",
        power: "480 HP",
        zeroToHundred: "3.8 s",
        drivetrain: "AWD",
        fuel: "90%",
        condition: "Excellent",
        topSpeed: 278
    },
    "6": {
        name: "Alfred Nova Sprint",
        status: "Reserved",
        engine: "2.5L Turbo I4",
        power: "300 HP",
        zeroToHundred: "4.8 s",
        drivetrain: "RWD",
        fuel: "71%",
        condition: "Very Good",
        topSpeed: 261
    }
};


/* ==========================================
   LOGIN / SIGN-UP FORM SWITCHING
========================================== */

function showAuthForm(type) {

    const login = document.getElementById("loginForm");
    const signup = document.getElementById("signupForm");
    const message = document.getElementById("authMessage");

    if (!login || !signup) return;

    login.style.display = type === "login" ? "block" : "none";
    signup.style.display = type === "signup" ? "block" : "none";

    if (message) message.textContent = "";
}


/* DEMO LOGIN */

function demoLogin(event) {

    if (event) event.preventDefault();

    const form = document.getElementById("loginForm");
    const message = document.getElementById("authMessage");

    if (form && !form.reportValidity()) return;

    if (message) {
        message.textContent =
            "Demo only: connect a secure authentication backend to sign in.";
    }
}


/* DEMO SIGN-UP */

function demoSignup(event) {

    if (event) event.preventDefault();

    const password = document.getElementById("signupPassword");
    const confirm = document.getElementById("confirmPassword");
    const message = document.getElementById("authMessage");

    if (!password || !confirm || !message) return;

    if (password.value.length < 8) {
        message.textContent =
            "Please use a password with at least 8 characters.";
        return;
    }

    if (password.value !== confirm.value) {
        message.textContent = "Passwords do not match.";
        return;
    }

    message.textContent =
        "Demo only: connect a secure backend to create an account.";
}


/* ==========================================
   LOGOUT THANK-YOU SCREEN
========================================== */

function showLogoutThankYou() {

    const thankYou = document.getElementById("logoutThankYou");

    if (!thankYou) return;

    thankYou.classList.add("show");
}


/* ==========================================
   WELCOME SCREEN HELPER
========================================== */

function showWelcomeScreen() {

    const welcomeScreen = document.getElementById("welcomeScreen");

    if (!welcomeScreen) return;

    welcomeScreen.classList.remove("closing", "launching");
    welcomeScreen.style.display = "";
    welcomeScreen.classList.add("show");

    const video = welcomeScreen.querySelector(".welcome-video");

    if (video) {
        video.muted = true;
        video.play().catch(() => {});
    }
}


/* ==========================================
   DOM READY
========================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* AUTOMOTIVE BACKGROUND VIDEO */

    const video = document.getElementById("heroVideo");

    if (video) {

        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;

        video.play().catch(() => {
            console.warn("Background video could not autoplay.");
        });

        video.addEventListener("error", () => {
            console.error("Unable to load the background video.");
        });
    }


    /* MOBILE NAVIGATION */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        function closeMenu() {

            mainNav.classList.remove("nav-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            menuToggle.textContent = "☰";
        }

        menuToggle.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("nav-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    }


    /* ANIMATED RACING LIGHT */

    const hero = document.querySelector(".hero");

    if (hero && !hero.querySelector(".racing-light")) {

        const light = document.createElement("div");

        light.className = "racing-light";
        light.setAttribute("aria-hidden", "true");

        hero.appendChild(light);
    }


    /* ==========================================
       GARAGE LIGHTBOX + CAR STATUS + SPEED CHART
    ========================================== */

    const lightbox = document.getElementById("carLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxStatus = document.getElementById("lightboxStatus");
    const speedChart = document.getElementById("speedChart");
    const lightboxClose = document.getElementById("lightboxClose");

    const garageItems = document.querySelectorAll(".garage-item");

    let previousGalleryFocus = null;

    function getStatusClass(status) {

        if (status === "Available") return "status-ok";
        if (status === "Reserved") return "status-warn";

        return "status-busy";
    }

    function renderStatus(car) {

        if (!lightboxStatus) return;

        const items = [
            {
                label: "Status",
                value: car.status,
                className: getStatusClass(car.status)
            },
            { label: "Engine", value: car.engine },
            { label: "Power", value: car.power },
            { label: "0–100 km/h", value: car.zeroToHundred },
            { label: "Drivetrain", value: car.drivetrain },
            { label: "Fuel", value: car.fuel },
            { label: "Condition", value: car.condition },
            { label: "Top Speed", value: car.topSpeed + " km/h" }
        ];

        lightboxStatus.innerHTML = "";

        items.forEach(item => {

            const li = document.createElement("li");
            const label = document.createElement("span");

            if (item.className) {
                li.classList.add(item.className);
            }

            label.textContent = item.label;

            li.appendChild(label);
            li.appendChild(document.createTextNode(item.value));

            lightboxStatus.appendChild(li);
        });
    }

    function renderChart(selectedId) {

        if (!speedChart) return;

        const cars = Object.entries(carData);

        const maxSpeed = Math.max(
            ...cars.map(([, car]) => car.topSpeed)
        );

        speedChart.innerHTML = "";

        cars.forEach(([id, car]) => {

            const row = document.createElement("div");
            row.className = "speed-row";

            if (id === selectedId) {
                row.classList.add("is-selected");
            }

            const name = document.createElement("span");
            name.className = "speed-name";
            name.textContent = car.name;

            const track = document.createElement("div");
            track.className = "speed-track";

            const bar = document.createElement("div");
            bar.className = "speed-bar";
            bar.dataset.width = (car.topSpeed / maxSpeed) * 100;

            const value = document.createElement("span");
            value.className = "speed-value";
            value.textContent = car.topSpeed + " km/h";

            track.appendChild(bar);
            row.appendChild(name);
            row.appendChild(track);
            row.appendChild(value);

            speedChart.appendChild(row);
        });

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                speedChart.querySelectorAll(".speed-bar").forEach(bar => {
                    bar.style.width = bar.dataset.width + "%";
                });

            });

        });
    }

    function openLightbox(item) {

        const id = item.dataset.car;
        const car = carData[id];
        const img = item.querySelector("img");

        if (!car || !img || !lightbox) return;

        previousGalleryFocus = document.activeElement;

        if (lightboxImage) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || car.name;
        }

        if (lightboxTitle) {
            lightboxTitle.textContent = car.name;
        }

        renderStatus(car);
        renderChart(id);

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";

        if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {

        if (!lightbox) return;

        lightbox.classList.remove("active");
        document.body.style.overflow = "";

        if (previousGalleryFocus) {
            previousGalleryFocus.focus();
        }
    }

    if (lightbox && lightboxClose && speedChart) {

        garageItems.forEach(item => {

            item.addEventListener("click", () => {
                openLightbox(item);
            });

        });

        lightboxClose.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });
    }


    /* ==========================================
       CAROUSEL
       DOTS + ARROWS + SWIPE + MOUSE DRAG
    ========================================== */

    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");

    const slides = track
        ? track.querySelectorAll(".carousel-slide")
        : [];

    let currentIndex = 0;

    const totalSlides = slides.length;
    const dots = [];

    function updateCarouselDots() {

        dots.forEach((dot, index) => {

            const active = index === currentIndex;

            dot.classList.toggle("active", active);

            dot.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );

        });
    }

    function goToSlide(index) {

        if (!track || totalSlides === 0) return;

        currentIndex =
            ((index % totalSlides) + totalSlides) % totalSlides;

        track.style.transform =
            `translate3d(-${currentIndex * 100}%, 0, 0)`;

        updateCarouselDots();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (track && totalSlides > 0) {

        if (dotsContainer) dotsContainer.innerHTML = "";

        if (dotsContainer) {

            slides.forEach((_, index) => {

                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "carousel-dot";

                dot.setAttribute(
                    "aria-label",
                    "Go to car " + (index + 1)
                );

                dot.addEventListener("click", () => {
                    goToSlide(index);
                });

                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", nextSlide);
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", prevSlide);
        }

        // Touch swipe

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener("touchstart", event => {

            if (event.changedTouches.length) {
                touchStartX = event.changedTouches[0].screenX;
            }

        }, { passive: true });

        track.addEventListener("touchend", event => {

            if (event.changedTouches.length) {

                touchEndX = event.changedTouches[0].screenX;

                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > 50) {
                    diff > 0 ? nextSlide() : prevSlide();
                }
            }

        }, { passive: true });

        // Mouse drag

        let isDragging = false;
        let dragStartX = 0;
        let dragEndX = 0;

        track.addEventListener("mousedown", event => {

            if (event.button !== 0) return;

            isDragging = true;
            dragStartX = event.pageX;
            dragEndX = event.pageX;

            track.style.cursor = "grabbing";
        });

        track.addEventListener("mousemove", event => {

            if (isDragging) {
                dragEndX = event.pageX;
            }

        });

        function finishDrag() {

            if (!isDragging) return;

            isDragging = false;
            track.style.cursor = "grab";

            const diff = dragStartX - dragEndX;

            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }

        track.addEventListener("mouseup", finishDrag);
        track.addEventListener("mouseleave", finishDrag);

        track.style.cursor = "grab";

        goToSlide(0);
    }


    /* ==========================================
       CAR STATS MODAL + PERFORMANCE GRAPH
    ========================================== */

    const statsModal = document.getElementById("carStatsModal");
    const statsClose = document.getElementById("closeModal");

    const carCards = document.querySelectorAll(".car-card");
    const viewBtns = document.querySelectorAll(".view-stats-btn");

    const mName = document.getElementById("modalCarName");
    const mImage = document.getElementById("modalCarImage");
    const mHp = document.getElementById("modalHp");
    const mSpeed = document.getElementById("modalSpeed");
    const mTop = document.getElementById("modalTop");

    const modalCarStatus = document.getElementById("modalCarStatus");

    const barHp = document.getElementById("barHp");
    const barSpeed = document.getElementById("barSpeed");
    const barHandling = document.getElementById("barHandling");

    let previousStatsFocus = null;
    let graphTimer = null;

    function setBarWidth(bar, value) {

        if (!bar) return;

        const number = Number(value);

        const safeValue = Number.isFinite(number)
            ? Math.max(0, Math.min(100, number))
            : 0;

        bar.style.width = safeValue + "%";
    }

    function openStats(card) {

        if (!statsModal) return;

        previousStatsFocus = document.activeElement;

        const name = card.getAttribute("data-name") || "Unknown Car";
        const status = card.getAttribute("data-status") || "CONCEPT";
        const hp = card.getAttribute("data-hp") || "N/A";
        const speed = card.getAttribute("data-speed") || "N/A";
        const top = card.getAttribute("data-top") || "N/A";

        const gHp = card.getAttribute("data-graph-hp");
        const gSpeed = card.getAttribute("data-graph-speed");
        const gHandling = card.getAttribute("data-graph-handling");

        const image = card.querySelector("img");

        if (mName) mName.textContent = name;
        if (mHp) mHp.textContent = hp;
        if (mSpeed) mSpeed.textContent = speed;
        if (mTop) mTop.textContent = top;

        if (modalCarStatus) {
            modalCarStatus.textContent = status.toUpperCase();
        }

        if (mImage && image) {
            mImage.src = image.src;
            mImage.alt = image.alt || name;
        }

        setBarWidth(barHp, 0);
        setBarWidth(barSpeed, 0);
        setBarWidth(barHandling, 0);

        if (graphTimer !== null) {
            clearTimeout(graphTimer);
        }

        statsModal.classList.add("active");
        statsModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (statsClose) statsClose.focus();

        graphTimer = window.setTimeout(() => {

            setBarWidth(barHp, gHp);
            setBarWidth(barSpeed, gSpeed);
            setBarWidth(barHandling, gHandling);

            graphTimer = null;

        }, 100);
    }

    function closeStats() {

        if (!statsModal) return;

        statsModal.classList.remove("active");
        statsModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (graphTimer !== null) {
            clearTimeout(graphTimer);
            graphTimer = null;
        }

        if (
            previousStatsFocus &&
            typeof previousStatsFocus.focus === "function"
        ) {
            previousStatsFocus.focus();
        }
    }

    if (statsModal && carCards.length > 0) {

        carCards.forEach(card => {

            card.addEventListener("click", event => {

                if (event.target.closest(".view-stats-btn")) return;

                openStats(card);
            });

        });

        viewBtns.forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                const card = button.closest(".car-card");

                if (card) openStats(card);
            });

        });

        if (statsClose) {
            statsClose.addEventListener("click", closeStats);
        }

        statsModal.addEventListener("click", event => {

            if (event.target === statsModal) {
                closeStats();
            }

        });
    }


    /* ==========================================
       KEYBOARD CONTROLS
    ========================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            lightbox &&
            lightbox.classList.contains("active")
        ) {
            closeLightbox();
            return;
        }

        if (
            event.key === "Escape" &&
            statsModal &&
            statsModal.classList.contains("active")
        ) {
            closeStats();
            return;
        }

        if (
            event.key === "Escape" &&
            mainNav &&
            mainNav.classList.contains("nav-open")
        ) {

            mainNav.classList.remove("nav-open");

            if (menuToggle) {

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                menuToggle.textContent = "☰";
            }
        }

        if (
            event.target instanceof HTMLElement &&
            (
                event.target.matches("input, textarea, select") ||
                event.target.isContentEditable
            )
        ) return;

        const modalIsOpen =
            (lightbox && lightbox.classList.contains("active")) ||
            (statsModal && statsModal.classList.contains("active"));

        if (modalIsOpen) return;

        if (event.key === "ArrowRight" && totalSlides > 0) {
            nextSlide();
        }

        if (event.key === "ArrowLeft" && totalSlides > 0) {
            prevSlide();
        }

    });


    /* ==========================================
       WELCOME SCREEN ENGINE ANIMATION
    ========================================== */

    const welcomeScreen = document.getElementById("welcomeScreen");
    const enterButton = document.getElementById("enterWebsite");

    if (welcomeScreen && enterButton) {

        const welcomeVideo =
            welcomeScreen.querySelector(".welcome-video");

        const enterLabel =
            enterButton.querySelector(".enter-label");

        let isEntering = false;

        try {

            if (
                sessionStorage.getItem("showWelcomeScreen") === "true"
            ) {

                sessionStorage.removeItem("showWelcomeScreen");
                showWelcomeScreen();
            }

        } catch (error) {
            // Continue if session storage is unavailable.
        }

        enterButton.addEventListener("click", () => {

            if (isEntering) return;

            isEntering = true;

            welcomeScreen.classList.remove("closing");
            welcomeScreen.classList.add("launching");

            enterButton.setAttribute(
                "aria-label",
                "Starting engine"
            );

            if (enterLabel) {
                enterLabel.textContent = "STARTING ENGINE...";
            }

            window.setTimeout(() => {

                welcomeScreen.classList.remove("launching");
                welcomeScreen.classList.add("closing");

                if (welcomeVideo) welcomeVideo.pause();

                window.setTimeout(() => {

                    welcomeScreen.classList.remove(
                        "show",
                        "closing"
                    );

                    welcomeScreen.style.display = "none";

                    enterButton.removeAttribute("aria-label");

                    if (enterLabel) {
                        enterLabel.textContent = "START YOUR DRIVE";
                    }

                    isEntering = false;

                }, 700);

            }, 1100);

        });
    }

});


/* ==========================================
   CONTACT FORM + FIRESTORE DATABASE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contactForm");
    const contactMessage = document.getElementById("contactMessage");

    if (!contactForm || !contactMessage) return;

    const submitButton = contactForm.querySelector('[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {

            contactMessage.textContent =
                "Please complete all fields.";

            contactMessage.style.color = "#ff7777";

            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "SENDING MESSAGE...";
        }

        contactMessage.textContent = "Sending your message...";
        contactMessage.style.color = "#00eaff";

        try {

            // Get the currently logged-in Firebase user
            const currentUser = auth.currentUser;

            // Save the message to Firestore
            await addDoc(collection(db, "messages"), {

                userId: currentUser ? currentUser.uid : null,

                name: name,
                email: email,
                subject: subject,
                message: message,

                status: "unread",

                createdAt: serverTimestamp()

            });

            contactMessage.textContent =
                "MESSAGE SENT SUCCESSFULLY! Thank you for contacting ALFRED.";

            contactMessage.style.color = "#55dd88";

            contactForm.reset();

        } catch (error) {

            console.error("Contact form error:", error);

            contactMessage.textContent =
                "FAILED TO SEND: " + error.message;

            contactMessage.style.color = "#ff7777";

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "SEND MESSAGE";
            }

        }

    });

});
