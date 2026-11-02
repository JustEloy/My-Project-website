
/* ==========================================
   ALFRED AUTOMOTIVE
   FIREBASE AUTHENTICATION + FIRESTORE
========================================== */

// Firebase Configuration
import { auth, db } from "./firebase-config.js";

// Firebase Authentication
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase Firestore
import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";


/* ==========================================
   AUTHENTICATION ELEMENTS
========================================== */

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");
const logoutButton = document.getElementById("logoutButton");
const userEmail = document.getElementById("userEmail");

const toggleButton = document.getElementById("toggleButton");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");


/* ==========================================
   MESSAGE HANDLER
========================================== */

function showMessage(message, success = false) {
    if (!authMessage) return;

    authMessage.textContent = message;
    authMessage.style.color = success ? "#55dd88" : "#ff7777";
}


/* ==========================================
   FIREBASE ERROR MESSAGES
========================================== */

function friendlyError(error) {
    const errors = {
        "auth/email-already-in-use":
            "This email already has an account. Please log in.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/weak-password":
            "Choose a stronger password with at least 6 characters.",

        "auth/invalid-credential":
            "Incorrect email or password.",

        "auth/user-not-found":
            "No account found. Please create an account first.",

        "auth/wrong-password":
            "Incorrect email or password.",

        "auth/too-many-requests":
            "Too many attempts. Please wait and try again.",

        "auth/network-request-failed":
            "Network error. Check your internet connection.",

        "permission-denied":
            "Database permission denied. Check your Firestore Security Rules.",

        "firestore/permission-denied":
            "Database permission denied. Check your Firestore Security Rules."
    };

    return errors[error.code] ||
        "Something went wrong. Please try again.";
}


/* ==========================================
   SWITCH LOGIN / SIGN-UP FORMS
========================================== */

function showLoginForm() {
    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";

    if (formTitle) formTitle.textContent = "LOGIN";

    if (toggleButton) {
        toggleButton.textContent = "CREATE ACCOUNT";
    }

    if (toggleText) {
        toggleText.textContent = "Don't have an account?";
    }
}

function showSignupForm() {
    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "block";

    if (formTitle) {
        formTitle.textContent = "CREATE ACCOUNT";
    }

    if (toggleButton) {
        toggleButton.textContent = "LOG IN";
    }

    if (toggleText) {
        toggleText.textContent = "Already have an account?";
    }
}

if (toggleButton && loginForm && signupForm) {
    toggleButton.addEventListener("click", () => {
        const loginIsVisible =
            window.getComputedStyle(loginForm).display !== "none";

        if (loginIsVisible) {
            showSignupForm();
        } else {
            showLoginForm();
        }

        showMessage("");
    });
}


/* ==========================================
   CREATE ACCOUNT + SAVE TO FIRESTORE
========================================== */

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("");

        const nameInput = document.getElementById("signupName");
        const emailInput = document.getElementById("signupEmail");
        const passwordInput = document.getElementById("signupPassword");
        const confirmInput = document.getElementById("confirmPassword");

        if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
            showMessage("The sign-up form is missing a required field.");
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        if (!name) {
            showMessage("Please enter your name.");
            return;
        }

        if (!email) {
            showMessage("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Your passwords do not match.");
            return;
        }

        const submitButton =
            signupForm.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "CREATING ACCOUNT...";
        }

        try {
            // STEP 1: Create Firebase Authentication account
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // STEP 2: Save user's display name
            await updateProfile(result.user, {
                displayName: name
            });

            // STEP 3: Save user information to Firestore
            await setDoc(doc(db, "users", result.user.uid), {
                name: name,
                email: email,
                createdAt: serverTimestamp()
            });

            console.log("User successfully saved to Firestore!");

            // STEP 4: Sign out after successful registration
            await signOut(auth);

            // STEP 5: Reset registration form
            signupForm.reset();

            // STEP 6: Return to login form
            showLoginForm();

            const loginEmail = document.getElementById("loginEmail");
            const loginPassword = document.getElementById("loginPassword");

            if (loginEmail) {
                loginEmail.value = email;
            }

            if (loginPassword) {
                loginPassword.value = "";
            }

            showMessage(
                "Account created successfully! Your information has been saved. Please log in.",
                true
            );

        } catch (error) {
            console.error("Signup error:", error);
            showMessage(friendlyError(error));

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "CREATE ACCOUNT";
            }
        }
    });
}


/* ==========================================
   LOGIN + AUTOMOTIVE WELCOME SCREEN
========================================== */

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        showMessage("");

        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        if (!emailInput || !passwordInput) {
            showMessage("The login form is missing a required field.");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter your email and password.");
            return;
        }

        const submitButton =
            loginForm.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "LOGGING IN...";
        }

        try {
            // Sign in using Firebase Authentication
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Trigger automotive welcome screen
            sessionStorage.setItem("showWelcomeScreen", "true");
            sessionStorage.removeItem("showLogoutThankYou");

            // Redirect to homepage
            window.location.replace("index.html");

        } catch (error) {
            console.error("Login error:", error);
            showMessage(friendlyError(error));

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "LOG IN";
            }
        }
    });
}


/* ==========================================
   AUTHENTICATION STATE
========================================== */

onAuthStateChanged(auth, (user) => {

    if (userEmail) {
        userEmail.textContent = user
            ? (user.displayName || user.email)
            : "Not logged in";
    }

    console.log(
        "Firebase authentication status:",
        user ? "Logged in" : "Not logged in"
    );

});


/* ==========================================
   LOG OUT + THANK-YOU SCREEN
========================================== */

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {

        logoutButton.disabled = true;

        try {
            await signOut(auth);

            sessionStorage.removeItem("showWelcomeScreen");
            sessionStorage.setItem("showLogoutThankYou", "true");

            window.location.replace("login.html");

        } catch (error) {
            console.error("Logout error:", error);

            alert("Unable to log out. Please try again.");

            logoutButton.disabled = false;
        }

    });
}


/* ==========================================
   INITIAL LOGIN FORM
========================================== */

showLoginForm();
