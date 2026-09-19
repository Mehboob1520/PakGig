/* ==========================================================================
   PakGig — Client-Side Auth Guard (DEMO ONLY)
   login.html currently sets localStorage.userLoggedIn = "true" on sign-in.
   This helper lets protected pages (profile.html, order.html, messages.html,
   escrow.html, admin.html) redirect back to login.html if that flag is
   missing, so a signed-out visitor can't just open the URL directly.
 
   IMPORTANT: this is a UX convenience, NOT real security — anyone can set
   the flag in devtools. Once you have a backend, replace this with a real
   session check: verify an httpOnly session cookie or JWT server-side (or
   call e.g. GET /api/me on page load) instead of trusting localStorage.
 
   Usage — add near the top of <body>, before the page's own <script>:
       <script src="js/utils.js"></script>
       <script src="js/auth.js"></script>
       <script>PakGig.requireLogin();</script>          // any signed-in user
       <script>PakGig.requireLogin({ adminOnly: true }); </script> // admin.html
   ========================================================================== */
 
(function (global) {
    "use strict";
 
    const PakGig = global.PakGig || {};
 
    PakGig.isLoggedIn = function () {
        return localStorage.getItem("userLoggedIn") === "true";
    };
 
    // Demo-only role flag. Set this yourself after a real login response,
    // e.g. localStorage.setItem("userRole", "admin").
    PakGig.getRole = function () {
        return localStorage.getItem("userRole") || "buyer";
    };
 
    PakGig.requireLogin = function (opts) {
        opts = opts || {};
        const redirectTo = opts.redirectTo || "login.html";
 
        if (!PakGig.isLoggedIn()) {
            window.location.href = redirectTo;
            return false;
        }
        if (opts.adminOnly && PakGig.getRole() !== "admin") {
            window.location.href = "index.html";
            return false;
        }
        return true;
    };
 
    PakGig.logout = function (redirectTo) {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userRole");
        window.location.href = redirectTo || "login.html";
    };
 
    global.PakGig = PakGig;
})(window);
 
