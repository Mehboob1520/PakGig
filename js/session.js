/* PakGig — Auth/session helpers (Supabase version)
   Used by every page: index, login, signup, Services, dashboard, order,
   messages, escrow, profile, admin. */
import { supabase } from "./supabaseClient.js";

// Turns a raw Supabase auth error message into a friendly line.
export function friendlyAuthError(message) {
    const m = (message || "").toLowerCase();
    if (m.includes("invalid login credentials")) return "Email ya password ghalat hai.";
    if (m.includes("user already registered")) return "Is email se pehle hi account bana hua hai.";
    if (m.includes("password should be at least")) return "Password kam az kam 6 characters ka hona chahiye.";
    if (m.includes("invalid email") || m.includes("unable to validate email")) return "Email address theek nahi hai.";
    if (m.includes("email not confirmed")) return "Pehle apna email verify karein.";
    if (m.includes("rate limit")) return "Bohot zyada koshishein ho gayi hain, thodi dair baad try karein.";
    if (m.includes("has_history")) return "Ye account delete nahi ho sakta kyunke iske sath orders/withdrawals ka record maujood hai.";
    return message || "Kuch masla ho gaya, dobara koshish karein.";
}

// Resolves with the logged-in user (or null) once Supabase has checked
// the current session.
export async function whenAuthReady() {
    const { data } = await supabase.auth.getSession();
    return data.session ? data.session.user : null;
}

// For pages that require a logged-in user: redirects to login.html (or
// index.html, if adminOnly and the user isn't an admin) and otherwise
// resolves with { user }.
export async function requireLogin(opts = {}) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
        window.location.href = "login.html";
        return new Promise(() => {}); // page is navigating away
    }
    const user = session.user;
    if (opts.adminOnly) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (!profile || profile.role !== "admin") {
            window.location.href = "index.html";
            return new Promise(() => {});
        }
    }
    return { user };
}

// Wires up every element with a [data-logout] attribute to sign out and
// redirect (default: the element's own href, else index.html).
export function bindLogout(redirectTo) {
    document.querySelectorAll("[data-logout]").forEach((el) => {
        el.addEventListener("click", async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = redirectTo || el.getAttribute("href") || "index.html";
        });
    });
}

// Shows/hides the "Sign In / Join Free" buttons vs the profile menu in the
// navbar, and keeps them in sync whenever the user logs in/out.
export async function bindNavbar() {
    const { data } = await supabase.auth.getSession();
    await updateNavbar(data.session);
    supabase.auth.onAuthStateChange((_event, session) => updateNavbar(session));
}

async function updateNavbar(session) {
    const authButtons = document.getElementById("auth-buttons");
    const profileMenu = document.getElementById("user-profile-menu");
    if (!authButtons || !profileMenu) return;

    authButtons.classList.remove("invisible");

    if (!session) {
        authButtons.classList.remove("hidden");
        authButtons.classList.add("flex");
        profileMenu.classList.add("hidden");
        profileMenu.classList.remove("flex");
        return;
    }

    authButtons.classList.add("hidden");
    profileMenu.classList.remove("hidden");
    profileMenu.classList.add("flex");

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

    const name = (profile && profile.full_name) || session.user.email || "User";
    const avatar = document.getElementById("navAvatar");
    const navName = document.getElementById("navName");
    if (avatar) avatar.textContent = (name.trim().charAt(0) || "U").toUpperCase();
    if (navName) navName.textContent = name;
}

export async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "index.html";
}
