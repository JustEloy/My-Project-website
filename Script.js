
/* ==========================================
   ALFRED AUTOMOTIVE
   COMBINED MAIN JAVASCRIPT
   Firebase + Original Website Features
========================================== */

import { db, auth } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


/* ==========================================
   1. CAR DATA
========================================== */

const carData = {
    "1": {
        name: "Alfred Apex R",
        status: "Available",
        engine: "3.8L Twin-Turbo V6",
        power: "580 HP",
        zeroToHundred: "3.1 s",
        drivetrain: "AWD",
        condition: "92%",
        conditionText: "Excellent",
        speed: "330"
    },

    "2": {
        name: "Alfred Storm GT",
        status: "Reserved",
        engine: "4.0L Twin-Turbo V8",
        power: "620 HP",
        zeroToHundred: "3.3 s",
        drivetrain: "RWD",
        condition: "78%",
        conditionText: "Very Good",
        speed: "318"
    },

    "3": {
        name: "Alfred Phantom X",
        status: "Available",
        engine: "5.2L V10",
        power: "640 HP",
        zeroToHundred: "3.4 s",
        drivetrain: "AWD",
        condition: "85%",
        conditionText: "Excellent",
        speed: "305"
    },

    "4": {
        name: "Alfred Blaze S",
        status: "In Service",
        engine: "2.0L Turbo I4",
        power: "350 HP",
        zeroToHundred: "4.2 s",
        drivetrain: "FWD",
        condition: "64%",
        conditionText: "Good",
        speed: "292"
    },

    "5": {
        name: "Alfred Titan RS",
        status: "Available",
        engine: "3.0L Twin-Turbo I6",
        power: "480 HP",
        zeroToHundred: "3.8 s",
        drivetrain: "AWD",
        condition: "90%",
        conditionText: "Excellent",
        speed: "278"
    },

    "6": {
        name: "Alfred Nova Sprint",
        status: "Reserved",
        engine: "2.5L Turbo I4",
        power: "300 HP",
        zeroToHundred: "4.8 s",
        drivetrain: "RWD",
        condition: "71%",
        conditionText: "Very Good",
        speed: "261"
    }
};


/* ==========================================
   2. AUTHENTICATION FORM HELPERS
========================================== */

function showAuthForm(type) {
    const login = document.getElementById("loginForm");
    const signup = document.getElementById("signupForm");
    const message = document.getElementById("authMessage");

    if (!login || !signup) return;

    login.style.display = type === "login" ? "block" : "none";
    signup.style.display = type === "signup" ? "block" : "none";

    if (message) {
        message.textContent = "";
    }
}

window.showAuthForm = showAuthForm;


/* Demo login function for pages that still use it */
function demoLogin(event) {
    if (event) event.preventDefault();

    console.warn(
        "Demo login is disabled. Use Firebase Authentication instead."
    );
}

window.demoLogin = demoLogin;


/* Demo signup function for pages that still use it */
function demoSignup(event) {
    if (event) event.preventDefault();

    console.warn(
        "Demo signup is disabled. Use Firebase Authentication instead."
    );
}

window.demoSignup = demoSignup;


/* ==========================================
   3. LOGOUT THANK-YOU SCREEN
========================================== */

function showLogoutThankYou() {
    const logoutScreen = document.getElementById("logoutThankYou");

    if (!logoutScreen) return;

    logoutScreen.classList.add("show");
    logoutScreen.setAttribute("aria-hidden", "false");
}

window.showLogoutThankYou = showLogoutThankYou;


/* ==========================================
   4. WELCOME SCREEN
========================================== */

function showWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcomeScreen");
    const welcomeVideo = document.querySelector(".welcome-video");

    if (!welcomeScreen) return;

    welcomeScreen.style.display = "flex";
    welcomeScreen.classList.remove("closing", "launching");

    welcomeScreen.classList.add("show");
    welcomeScreen.setAttribute("aria-hidden", "false");

    if (welcomeVideo) {
        welcomeVideo.currentTime = 0;

        const playPromise = welcomeVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Welcome video autoplay was blocked:", error);
            });
        }
    }
}

window.showWelcomeScreen = showWelcomeScreen;


/* ==========================================
   5. WAIT FOR FIREBASE AUTHENTICATION
========================================== */

function waitForAuthenticatedUser() {
    return new Promise((resolve, reject) => {
        let unsubscribe = null;

        unsubscribe = onAuthStateChanged(
            auth,
            currentUser => {
                if (unsubscribe) {
                    unsubscribe();
                }

                if (currentUser) {
                    resolve(currentUser);
                } else {
                    reject(
                        new Error("Please log in before sending a message.")
                    );
                }
            },
            error => {
                if (unsubscribe) {
                    unsubscribe();
                }

                reject(error);
            }
        );
    });
}


/* ==========================================
   6. HERO VIDEO
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const heroVideo = document.getElementById("heroVideo");

    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;

        const playPromise = heroVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Hero video autoplay was blocked:", error);
            });
        }
    }
});


/* ==========================================
   7. MOBILE NAVIGATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("active");
        menuToggle.classList.toggle("active");

        const isOpen = mainNav.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", event => {
        if (
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            mainNav.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
});


/* ==========================================
   8. RACING LIGHT ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const racingLights = document.querySelectorAll(".racing-light");

    racingLights.forEach(light => {
        light.classList.add("active");
    });
});


/* ==========================================
   9. GARAGE LIGHTBOX
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const carLightbox = document.getElementById("carLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxStatus = document.getElementById("lightboxStatus");
    const speedChart = document.getElementById("speedChart");
    const lightboxClose = document.getElementById("lightboxClose");

    const garageItems = document.querySelectorAll(".garage-item");

    if (!carLightbox || !garageItems.length) return;

    function openCarLightbox(item) {
        const carId = item.dataset.car;
        const car = carData[carId];

        if (!car) return;

        const image = item.querySelector("img");

        if (lightboxImage && image) {
            lightboxImage.src = image.src;
            lightboxImage.alt = car.name;
        }

        if (lightboxTitle) {
            lightboxTitle.textContent = car.name;
        }

        if (lightboxStatus) {
            lightboxStatus.textContent = car.status;
            lightboxStatus.className = "lightbox-status";

            lightboxStatus.classList.add(
                car.status.toLowerCase().replace(/\s+/g, "-")
            );
        }

        if (speedChart) {
            speedChart.style.width = `${car.speed / 3.5}%`;
            speedChart.setAttribute(
                "aria-label",
                `Top speed ${car.speed} kilometers per hour`
            );
        }

        carLightbox.classList.add("active");
        carLightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeCarLightbox() {
        carLightbox.classList.remove("active");
        carLightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    garageItems.forEach(item => {
        item.addEventListener("click", () => {
            openCarLightbox(item);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeCarLightbox);
    }

    carLightbox.addEventListener("click", event => {
        if (event.target === carLightbox) {
            closeCarLightbox();
        }
    });

    window.closeCarLightbox = closeCarLightbox;
});


/* ==========================================
   10. CAROUSEL
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const carouselTrack = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".carousel-slide");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");

    if (!carouselTrack || !slides.length) return;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const totalSlides = slides.length;

    function updateCarousel() {
        carouselTrack.style.transform =
            `translateX(-${currentIndex * 100}%)`;

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll("button");

            dots.forEach((dot, index) => {
                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

                dot.setAttribute(
                    "aria-current",
                    index === currentIndex ? "true" : "false"
                );
            });
        }
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function goToPrevious() {
        currentIndex =
            (currentIndex - 1 + totalSlides) % totalSlides;

        updateCarousel();
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = "";

        slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", () => {
                currentIndex = index;
                updateCarousel();
            });

            dotsContainer.appendChild(dot);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", goToNext);
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", goToPrevious);
    }

    /* Touch swipe */
    carouselTrack.addEventListener("touchstart", event => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener("touchend", event => {
        currentX = event.changedTouches[0].clientX;

        const difference = startX - currentX;

        if (Math.abs(difference) > 50) {
            difference > 0 ? goToNext() : goToPrevious();
        }
    });

    /* Mouse drag */
    carouselTrack.addEventListener("mousedown", event => {
        isDragging = true;
        startX = event.clientX;
        carouselTrack.style.cursor = "grabbing";
    });

    document.addEventListener("mouseup", event => {
        if (!isDragging) return;

        currentX = event.clientX;

        const difference = startX - currentX;

        if (Math.abs(difference) > 50) {
            difference > 0 ? goToNext() : goToPrevious();
        }

        isDragging = false;
        carouselTrack.style.cursor = "";
    });

    updateCarousel();

    window.goToNextSlide = goToNext;
    window.goToPreviousSlide = goToPrevious;
});


/* ==========================================
   11. CAR STATS MODAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const carStatsModal = document.getElementById("carStatsModal");
    const closeModal = document.getElementById("closeModal");

    const carCards = document.querySelectorAll(".car-card");
    const viewStatsButtons = document.querySelectorAll(".view-stats-btn");

    if (!carStatsModal) return;

    const modalTitle = document.getElementById("modalCarName");
    const modalStatus = document.getElementById("modalCarStatus");
    const modalEngine = document.getElementById("modalEngine");
    const modalPower = document.getElementById("modalPower");
    const modalAcceleration = document.getElementById("modalAcceleration");
    const modalDrivetrain = document.getElementById("modalDrivetrain");
    const modalCondition = document.getElementById("modalCondition");
    const modalConditionText = document.getElementById("modalConditionText");
    const graphBars = document.querySelectorAll(".graph-bar");

    function openStatsModal(carId) {
        const car = carData[carId];

        if (!car) return;

        if (modalTitle) modalTitle.textContent = car.name;
        if (modalStatus) modalStatus.textContent = car.status;
        if (modalEngine) modalEngine.textContent = car.engine;
        if (modalPower) modalPower.textContent = car.power;

        if (modalAcceleration) {
            modalAcceleration.textContent = car.zeroToHundred;
        }

        if (modalDrivetrain) {
            modalDrivetrain.textContent = car.drivetrain;
        }

        if (modalCondition) {
            modalCondition.textContent = car.condition;
        }

        if (modalConditionText) {
            modalConditionText.textContent = car.conditionText;
        }

        const graphValues = [
            Number.parseInt(car.speed, 10),
            Number.parseInt(car.power, 10),
            Number.parseInt(car.condition, 10),
            100 - Number.parseInt(car.zeroToHundred, 10) * 10
        ];

        graphBars.forEach((bar, index) => {
            const value = graphValues[index] || 0;

            bar.style.height = "0%";

            requestAnimationFrame(() => {
                bar.style.height = `${Math.min(value / 7, 100)}%`;
            });
        });

        carStatsModal.classList.add("active");
        carStatsModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeStatsModal() {
        carStatsModal.classList.remove("active");
        carStatsModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    carCards.forEach(card => {
        card.addEventListener("click", event => {
            if (event.target.closest(".view-stats-btn")) return;

            const carId = card.dataset.car;
            openStatsModal(carId);
        });
    });

    viewStatsButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();

            const carCard = button.closest(".car-card");

            if (carCard) {
                openStatsModal(carCard.dataset.car);
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener("click", closeStatsModal);
    }

    carStatsModal.addEventListener("click", event => {
        if (event.target === carStatsModal) {
            closeStatsModal();
        }
    });

    window.closeStatsModal = closeStatsModal;
});


/* ==========================================
   12. KEYBOARD CONTROLS
========================================== */

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    const carLightbox = document.getElementById("carLightbox");
    const carStatsModal = document.getElementById("carStatsModal");
    const mainNav = document.getElementById("mainNav");
    const menuToggle = document.getElementById("menuToggle");

    if (carLightbox && carLightbox.classList.contains("active")) {
        carLightbox.classList.remove("active");
        carLightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (carStatsModal && carStatsModal.classList.contains("active")) {
        carStatsModal.classList.remove("active");
        carStatsModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (mainNav) {
        mainNav.classList.remove("active");
    }

    if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});


/* ==========================================
   13. WELCOME SCREEN ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const welcomeScreen = document.getElementById("welcomeScreen");
    const enterButton = document.getElementById("enterWebsite");
    const welcomeVideo = document.querySelector(".welcome-video");

    if (!welcomeScreen) return;

    const shouldShowWelcome =
        sessionStorage.getItem("showWelcomeScreen") === "true";

    if (shouldShowWelcome) {
        sessionStorage.removeItem("showWelcomeScreen");
        showWelcomeScreen();
    }

    if (!enterButton) return;

    enterButton.addEventListener("click", () => {
        if (
            !welcomeScreen.classList.contains("show") &&
            welcomeScreen.style.display === "none"
        ) {
            return;
        }

        welcomeScreen.classList.add("launching");

        enterButton.disabled = true;

        setTimeout(() => {
            welcomeScreen.classList.add("closing");

            if (welcomeVideo) {
                welcomeVideo.pause();
            }

            setTimeout(() => {
                welcomeScreen.classList.remove(
                    "show",
                    "launching",
                    "closing"
                );

                welcomeScreen.style.display = "none";
                welcomeScreen.setAttribute("aria-hidden", "true");

                document.body.style.overflow = "";

                enterButton.disabled = false;
            }, 800);

        }, 500);
    });
});


/* ==========================================
   14. FIREBASE CONTACT FORM
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const contactMessage = document.getElementById("contactMessage");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async event => {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const subjectInput = document.getElementById("subject");
        const messageInput = document.getElementById("message");

        if (
            !nameInput ||
            !emailInput ||
            !subjectInput ||
            !messageInput
        ) {
            console.error("Contact form fields are missing.");
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        function showContactMessage(text, type) {
            if (!contactMessage) return;

            contactMessage.textContent = text;
            contactMessage.className = `contact-message ${type}`;
        }

        /* Validate required fields */
        if (!name || !email || !subject || !message) {
            showContactMessage(
                "PLEASE COMPLETE ALL FIELDS.",
                "error"
            );
            return;
        }

        if (name.length < 2) {
            showContactMessage(
                "PLEASE ENTER A VALID NAME.",
                "error"
            );
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showContactMessage(
                "PLEASE ENTER A VALID EMAIL ADDRESS.",
                "error"
            );
            return;
        }

        if (message.length < 10) {
            showContactMessage(
                "YOUR MESSAGE MUST CONTAIN AT LEAST 10 CHARACTERS.",
                "error"
            );
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        try {
            if (submitButton) {
                submitButton.disabled = true;

                if (submitButton.tagName === "BUTTON") {
                    submitButton.textContent = "SENDING...";
                } else {
                    submitButton.value = "SENDING...";
                }
            }

            showContactMessage(
                "CONNECTING TO FIREBASE...",
                "loading"
            );

            /* Make sure the visitor is logged in */
            const currentUser = await waitForAuthenticatedUser();

            /* Save the message to Firestore */
            await addDoc(collection(db, "messages"), {
                userId: currentUser.uid,
                name: name,
                email: email,
                subject: subject,
                message: message,
                status: "unread",
                createdAt: serverTimestamp()
            });

            showContactMessage(
                "MESSAGE SENT SUCCESSFULLY! THANK YOU.",
                "success"
            );

            contactForm.reset();

        } catch (error) {
            console.error("CONTACT FORM ERROR:", error);

            let errorText =
                "FAILED TO SEND MESSAGE. PLEASE TRY AGAIN.";

            if (error.code === "permission-denied") {
                errorText =
                    "FIRESTORE PERMISSION DENIED. CHECK YOUR FIRESTORE RULES.";
            } else if (
                error.message &&
                error.message.includes("Please log in")
            ) {
                errorText =
                    "PLEASE LOG IN BEFORE SENDING A MESSAGE.";
            } else if (error.code === "unavailable") {
                errorText =
                    "DATABASE UNAVAILABLE. CHECK YOUR INTERNET CONNECTION.";
            }

            showContactMessage(errorText, "error");

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                if (submitButton.tagName === "BUTTON") {
                    submitButton.textContent =
                        originalButtonText || "SEND MESSAGE";
                } else {
                    submitButton.value =
                        originalButtonText || "SEND MESSAGE";
                }
            }
        }
    });
});


/* ==========================================
   15. CONTACT FORM VALIDATION FUNCTION
========================================== */

function validateContact(event) {
    if (event) {
        event.preventDefault();
    }

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.requestSubmit();
    }
}

window.validateContact = validateContact;


/* ==========================================
   16. INITIALIZATION COMPLETE
========================================== */

console.log("ALFRED AUTOMOTIVE JAVASCRIPT LOADED");
console.log("Firebase contact form connected.");
console.log("Garage, carousel, welcome screen and animations initialized.");
