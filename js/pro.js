/* PakGig — Pro slab + withdrawal-limit helpers.
   The real rules live in the database (request_withdrawal / admin_set_pro).
   This file only reads Pro status and turns database error codes into
   friendly messages. */
import { supabase } from "./supabaseClient.js";

export const MIN_WITHDRAWAL = 500;
export const MAX_MONTHLY_WITHDRAWAL = 500000;
export const LIMITS_START = new Date("2028-01-01T00:00:00+05:00");

// Is this user a Pro member? (a user can only read their own row)
export async function amIPro(uid) {
    const { data, error } = await supabase.from("pro_memberships").select("user_id").eq("user_id", uid).maybeSingle();
    if (error) return false;
    return !!data;
}

// Admin only: ids of every Pro member.
export async function listProIds() {
    const { data, error } = await supabase.from("pro_memberships").select("user_id");
    if (error) throw error;
    return (data || []).map((r) => r.user_id);
}

// Admin only: make a user Pro after receiving a one-time fee of $100 or more.
export async function adminSetPro(userId, feeUsd) {
    const { error } = await supabase.rpc("admin_set_pro", { p_user: userId, p_fee_usd: feeUsd });
    if (error) throw error;
}

const MESSAGES = {
    below_minimum: "The minimum withdrawal is Rs. 500.",
    above_monthly_limit: "This would take you over the Rs. 500,000 monthly withdrawal limit. Try a smaller amount, wait for next month, or upgrade to Pro.",
    insufficient_balance: "Amount exceeds your available balance.",
    bad_amount: "Please enter a whole number of rupees.",
    bad_account: "Enter a valid account or wallet number.",
    bad_bank: "Please choose JazzCash, EasyPaisa or Bank Transfer.",
    sellers_only: "Only sellers can withdraw money.",
    account_suspended: "Your account is suspended.",
    not_authenticated: "Please log in again."
};

export function withdrawErrorMessage(err) {
    const raw = String((err && (err.message || err.details)) || "");
    for (const key of Object.keys(MESSAGES)) {
        if (raw.includes(key)) return MESSAGES[key];
    }
    return "Could not send the request. Please try again.";
}

export function proErrorMessage(err) {
    const raw = String((err && err.message) || "");
    if (raw.includes("pro_not_available_yet")) return "Pro starts on 1 January 2028.";
    if (raw.includes("fee_below_minimum")) return "The Pro fee must be $100 or more.";
    if (raw.includes("forbidden")) return "Only an admin can do this.";
    return "Could not update Pro status. Please try again.";
}
