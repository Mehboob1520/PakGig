   PakGig — Shared JS Utilities
   Small, dependency-free helpers reused across login.html, profile.html,
   order.html, messages.html, escrow.html and admin.html — so this logic
   lives in one place instead of being copy-pasted into every page.
 
   Include AFTER Tailwind's CDN script, BEFORE each page's own <script>:
       <script src="js/utils.js"></script>
   Everything below attaches to a single global: window.PakGig
   ========================================================================== */
 
(function (global) {
    "use strict";
 
    const PakGig = {};
 
    // ---------------------------------------------------------------------
    // Formatting
    // ---------------------------------------------------------------------
    PakGig.money = function (n) {
        return "Rs. " + Number(n || 0).toLocaleString();
    };
 
    PakGig.formatDate = function (dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };
 
    // ---------------------------------------------------------------------
    // Validation
    // ---------------------------------------------------------------------
    PakGig.isValidEmail = function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
    };
 
    // Returns a score 0-4 (used to drive password-strength meters)
    PakGig.passwordStrength = function (pw) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };
 
    // ---------------------------------------------------------------------
    // Alert boxes — expects an element with the given id already in the DOM,
    // e.g. <div id="alertBox" class="hidden p-3 rounded-lg text-xs font-medium border"></div>
    // ---------------------------------------------------------------------
    PakGig.showAlert = function (elementId, type, message, opts) {
        const box = document.getElementById(elementId);
        if (!box) return;
 
        const styles = type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-red-50 border-red-200 text-red-800";
 
        box.className = "p-3 rounded-lg text-xs font-medium border block " + styles;
        box.innerHTML = message;
 
        if (opts && opts.scrollTo) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        if (opts && opts.autoHideMs) {
            setTimeout(() => box.classList.add("hidden"), opts.autoHideMs);
        }
    };
 
    // ---------------------------------------------------------------------
    // Modal helpers — expects a wrapper div with class "hidden" by default,
    // toggled to/from "flex" (matches the modal pattern used throughout the site).
    // ---------------------------------------------------------------------
    PakGig.openModal = function (elementId) {
        const modal = document.getElementById(elementId);
        if (!modal) return;
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    };
 
    PakGig.closeModal = function (elementId) {
        const modal = document.getElementById(elementId);
        if (!modal) return;
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    };
 
    // Wires up the common "click outside" + "Escape key" close behavior
    // for a modal in one call.
    PakGig.bindModalDismiss = function (elementId) {
        const modal = document.getElementById(elementId);
        if (!modal) return;
 
        modal.addEventListener("click", (e) => {
            if (e.target === modal) PakGig.closeModal(elementId);
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.classList.contains("hidden")) {
                PakGig.closeModal(elementId);
            }
        });
    };
 
    // ---------------------------------------------------------------------
    // Avatar helper — consistent placeholder avatars (profile.html,
    // messages.html, admin.html all use this same DiceBear pattern).
    // ---------------------------------------------------------------------
    PakGig.avatarUrl = function (seed) {
        return "https://api.dicebear.com/7.x/initials/svg?seed=" +
            encodeURIComponent(seed) + "&backgroundColor=047857&textColor=ffffff";
    };
 
    global.PakGig = PakGig;
})(window);
 
