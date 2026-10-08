/* PakGig — Auth/session helpers (Supabase version)
   Used by every page: index, login, signup, Services, dashboard, order,
   messages, escrow, profile, admin. */
import { supabase } from "./supabaseClient.js";

// Turns a raw Supabase auth error message into a friendly line.
export function friendlyAuthError(message) {
    const m = (message || "").toLowerCase();
    if (m.includes("invalid login credentials")) return "Incorrect email or password.";
    if (m.includes("user already registered")) return "An account with this email already exists.";
    if (m.includes("password should be at least")) return "Password must be at least 6 characters long.";
    if (m.includes("invalid email") || m.includes("unable to validate email")) return "That email address doesn't look valid.";
    if (m.includes("email not confirmed")) return "Please verify your email first.";
    if (m.includes("for security purposes") || m.includes("you can only request this after")) return "Please wait a minute before requesting another email.";
    if (m.includes("rate limit")) return "Too many attempts. Please try again in a little while.";
    if (m.includes("email address") && m.includes("is invalid")) return "We couldn't send an email to this address right now. Please check the address and try again later, or contact pakgig.support@gmail.com.";
    if (m.includes("has_history")) return "This account can't be deleted because it has order or withdrawal records.";
    if (m.includes("kyc_required")) return "Please complete your identity verification (KYC) first.";
    return message || "Something went wrong. Please try again.";
}

// Supabase users have `id`; the pages were written using `uid` and
// `displayName`. This adds those two names so every page works the same.
function withAliases(user) {
    if (!user) return user;
    return Object.assign({}, user, {
        uid: user.id,
        displayName: (user.user_metadata && user.user_metadata.full_name) || ""
    });
}

// Resolves with the logged-in user (or null) once Supabase has checked
// the current session.
export async function whenAuthReady() {
    const { data } = await supabase.auth.getSession();
    return data.session ? withAliases(data.session.user) : null;
}

// For pages that require a logged-in user: redirects to login.html (or
// index.html, if adminOnly and the user isn't an admin) and otherwise
// resolves with { user }.
// KYC: every buyer and seller must have an approved KYC. Pages that call
// requireLogin() are sent to kyc.html until it is approved (admins are
// exempt). Only kyc.html and profile.html pass { skipKyc: true }.
export async function requireLogin(opts = {}) {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
        window.location.href = "login.html";
        return new Promise(() => {}); // page is navigating away
    }
    const user = withAliases(session.user);
    const { data: profile } = await supabase
        .from("profiles").select("role, kyc_status").eq("id", user.id).single();
    if (opts.adminOnly) {
        if (!profile || profile.role !== "admin") {
            window.location.href = "index.html";
            return new Promise(() => {});
        }
    }
    if (!opts.skipKyc) {
        const isAdmin = profile && profile.role === "admin";
        if (!isAdmin && (!profile || profile.kyc_status !== "approved")) {
            window.location.href = "kyc.html";
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
