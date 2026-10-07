/* PakGig — KYC helpers (Supabase).
   ID photos go to the PRIVATE storage bucket "kyc-docs" (folder = user id).
   Only the owner and admins can ever read them. */
import { supabase } from "./supabaseClient.js";

const BUCKET = "kyc-docs";
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Errors we raise ourselves (file checks) already carry a readable message.
function friendly(msg) {
    return Object.assign(new Error(msg), { friendly: true });
}

export function friendlyKycError(err) {
    if (err && err.friendly) return err.message;
    const m = ((err && err.message) || String(err || "")).toLowerCase();
    if (m.includes("already_submitted")) return "Your KYC has already been submitted.";
    if (m.includes("cnic_in_use")) return "This CNIC number is already in use on another account.";
    if (m.includes("bad_cnic")) return "The CNIC number must be 13 digits.";
    if (m.includes("bad_name")) return "Enter your full name exactly as written on your CNIC.";
    if (m.includes("under_18")) return "You must be at least 18 years old to complete KYC.";
    if (m.includes("bad_files") || m.includes("files_missing")) return "Your photos did not upload correctly. Please try again.";
    if (m.includes("account_suspended")) return "This account is suspended.";
    if (m.includes("not_needed")) return "Admin accounts do not need KYC.";
    if (m.includes("bad_reason")) return "Enter a rejection reason of at least 5 characters.";
    if (m.includes("not_allowed") || m.includes("forbidden")) return "This action is not allowed right now.";
    return "Something went wrong. Please try again.";
}

// Returns { status: 'none'|'pending'|'approved'|'rejected', reason, role }
export async function getMyKyc(userId) {
    const { data, error } = await supabase
        .from("profiles").select("role, kyc_status, kyc_reject_reason").eq("id", userId).single();
    if (error) throw error;
    return { status: data.kyc_status, reason: data.kyc_reject_reason, role: data.role };
}

function extOf(file) {
    return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

function checkFile(file, label) {
    if (!file) throw friendly("Please select an image for: " + label + ".");
    if (!OK_TYPES.includes(file.type)) throw friendly(label + ": only JPG, PNG or WEBP images are accepted.");
    if (file.size > MAX_BYTES) throw friendly(label + ": the image must be smaller than 5 MB.");
}

async function upload(userId, kind, file) {
    const path = `${userId}/${kind}-${Date.now()}.${extOf(file)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return path;
}

// files = { front, back, selfie } (File objects)
export async function submitKyc(user, { legalName, cnic, dob, files }) {
    checkFile(files.front, "Front of CNIC");
    checkFile(files.back, "Back of CNIC");
    checkFile(files.selfie, "Selfie");
    const front = await upload(user.id, "front", files.front);
    const back = await upload(user.id, "back", files.back);
    const selfie = await upload(user.id, "selfie", files.selfie);
    const { data, error } = await supabase.rpc("submit_kyc", {
        p_legal_name: legalName, p_cnic: cnic, p_dob: dob,
        p_front: front, p_back: back, p_selfie: selfie
    });
    if (error) throw error;
    return data;
}

// ---------- admin ----------

export async function listKyc(status) {
    let q = supabase.from("kyc_submissions").select("*").order("created_at", { ascending: true });
    if (status) q = q.eq("status", status);
    const { data: subs, error } = await q;
    if (error) throw error;
    const ids = [...new Set((subs || []).map((s) => s.user_id))];
    let people = {};
    if (ids.length) {
        const { data: ps } = await supabase.from("profiles").select("id, email, role, full_name").in("id", ids);
        (ps || []).forEach((p) => { people[p.id] = p; });
    }
    return (subs || []).map((s) => ({ ...s, profile: people[s.user_id] || {} }));
}

// Temporary (10 minute) links so an admin can look at the private photos.
export async function signedKycUrls(sub) {
    const { data, error } = await supabase.storage.from(BUCKET)
        .createSignedUrls([sub.front_path, sub.back_path, sub.selfie_path], 600);
    if (error) throw error;
    return { front: data[0].signedUrl, back: data[1].signedUrl, selfie: data[2].signedUrl };
}

export async function reviewKyc(id, decision, reason = "") {
    const { error } = await supabase.rpc("admin_review_kyc", { p_id: id, p_decision: decision, p_reason: reason });
    if (error) throw error;
}
