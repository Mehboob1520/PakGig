/* PakGig — Data access helpers (Supabase version)
   Talks to the profiles / gigs / orders / messages / withdrawals tables
   and the database functions (create_gig, create_order, order_action,
   request_withdrawal, mark_withdrawal_paid, admin_set_user_status,
   delete_my_account) that are already set up in Supabase. */
import { supabase } from "./supabaseClient.js";

// Wraps a timestamp string in a real Date that also has a .toMillis()
// method, so pages written against Firestore's Timestamp API (which has
// .toMillis()) keep working unchanged.
function withMillis(iso) {
    const d = iso ? new Date(iso) : new Date(0);
    d.toMillis = () => d.getTime();
    return d;
}

function mapOrder(o) {
    return {
        id: o.id,
        gigId: o.gig_id,
        buyerId: o.buyer_id,
        sellerId: o.seller_id,
        buyerName: o.buyer_name,
        sellerName: o.seller_name,
        title: o.title,
        amount: Number(o.amount),
        due: o.due,
        status: o.status,
        escrow: o.escrow,
        disputed: o.disputed,
        disputeStatus: o.dispute_status,
        disputeBy: o.dispute_by,
        disputeReason: o.dispute_reason,
        deposit: o.deposit || {},
        createdAt: withMillis(o.created_at)
    };
}

function mapWithdrawal(w) {
    return {
        id: w.id,
        sellerId: w.seller_id,
        sellerName: w.seller_name,
        amount: Number(w.amount),
        bank: w.bank,
        account: w.account,
        status: w.status,
        createdAt: withMillis(w.created_at),
        paidAt: w.paid_at ? withMillis(w.paid_at) : null
    };
}

function mapMessage(m) {
    return {
        id: m.id,
        orderId: m.order_id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        text: m.text,
        createdAt: withMillis(m.created_at)
    };
}

export function formatDate(d) {
    if (!d) return "—";
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date)) return "—";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(d) {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date)) return "";
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// ---------- profile ----------

export async function getMyProfile(user) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) throw error;
    return {
        id: data.id, fullName: data.full_name, email: data.email, role: data.role,
        tagline: data.tagline, phone: data.phone, city: data.city, skills: data.skills,
        bio: data.bio, status: data.status, createdAt: withMillis(data.created_at)
    };
}

export async function updateMyProfile(user, updates) {
    const { error } = await supabase.from("profiles").update({
        full_name: updates.fullName,
        tagline: updates.tagline,
        phone: updates.phone,
        city: updates.city,
        skills: updates.skills,
        bio: updates.bio
    }).eq("id", user.id);
    if (error) throw error;
}

export async function deleteMyAccount() {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) throw error;
    await supabase.auth.signOut();
}

// ---------- gigs ----------

export async function listGigs() {
    const { data, error } = await supabase
        .from("gigs")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((g) => ({
        id: g.id, sellerId: g.seller_id, sellerName: g.seller_name,
        title: g.title, description: g.description, category: g.category, price: Number(g.price)
    }));
}

export async function createGig({ title, description, category, price, deliveryDays }) {
    const { data, error } = await supabase.rpc("create_gig", {
        p_title: title, p_description: description, p_category: category,
        p_price: price, p_delivery_days: deliveryDays
    });
    if (error) throw error;
    return data;
}

// ---------- orders ----------

export async function createOrder(user, profile, gig, { payerName, method, tid, amountReported }) {
    const { data, error } = await supabase.rpc("create_order", {
        p_gig_id: gig.id, p_payer_name: payerName, p_method: method,
        p_tid: tid, p_amount_reported: amountReported
    });
    if (error) throw error;
    return data;
}

export async function orderAction(orderId, action, extra = {}) {
    const { error } = await supabase.rpc("order_action", {
        p_order_id: orderId, p_action: action, p_reason: extra.reason || ""
    });
    if (error) throw error;
}

// Fetches once, then keeps listening for changes and re-fetches — a
// realtime stand-in for Firestore's onSnapshot(). Returns an unsubscribe
// function you can call (e.g. when navigating away).
export function watchMyOrders(uid, onData, onError) {
    async function load() {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .or(`buyer_id.eq.${uid},seller_id.eq.${uid}`)
            .order("created_at", { ascending: false });
        if (error) { onError && onError(error); return; }
        onData((data || []).map(mapOrder));
    }
    load();
    const channel = supabase
        .channel("orders-" + uid)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `buyer_id=eq.${uid}` }, load)
        .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `seller_id=eq.${uid}` }, load)
        .subscribe();
    return () => supabase.removeChannel(channel);
}

export function watchAllOrders(onData, onError) {
    async function load() {
        const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (error) { onError && onError(error); return; }
        onData((data || []).map(mapOrder));
    }
    load();
    const channel = supabase
        .channel("orders-all")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
        .subscribe();
    return () => supabase.removeChannel(channel);
}

// ---------- withdrawals ----------

export async function requestWithdrawal(user, name, { amount, bank, account }) {
    const { data, error } = await supabase.rpc("request_withdrawal", {
        p_amount: amount, p_bank: bank, p_account: account
    });
    if (error) throw error;
    return data;
}

export async function markWithdrawalPaid(id) {
    const { error } = await supabase.rpc("mark_withdrawal_paid", { p_id: id });
    if (error) throw error;
}

export function watchMyWithdrawals(uid, onData, onError) {
    async function load() {
        const { data, error } = await supabase.from("withdrawals").select("*").eq("seller_id", uid).order("created_at", { ascending: false });
        if (error) { onError && onError(error); return; }
        onData((data || []).map(mapWithdrawal));
    }
    load();
    const channel = supabase
        .channel("withdrawals-" + uid)
        .on("postgres_changes", { event: "*", schema: "public", table: "withdrawals", filter: `seller_id=eq.${uid}` }, load)
        .subscribe();
    return () => supabase.removeChannel(channel);
}

export function watchAllWithdrawals(onData, onError) {
    async function load() {
        const { data, error } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
        if (error) { onError && onError(error); return; }
        onData((data || []).map(mapWithdrawal));
    }
    load();
    const channel = supabase
        .channel("withdrawals-all")
        .on("postgres_changes", { event: "*", schema: "public", table: "withdrawals" }, load)
        .subscribe();
    return () => supabase.removeChannel(channel);
}

// ---------- messages ----------

export function watchMessages(orderId, onData, onError) {
    async function load() {
        const { data, error } = await supabase.from("messages").select("*").eq("order_id", orderId).order("created_at", { ascending: true });
        if (error) { onError && onError(error); return; }
        onData((data || []).map(mapMessage));
    }
    load();
    const channel = supabase
        .channel("messages-" + orderId)
        .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `order_id=eq.${orderId}` }, load)
        .subscribe();
    return () => supabase.removeChannel(channel);
}

export async function sendMessage(orderId, user, myName, text) {
    const { error } = await supabase.from("messages").insert({
        order_id: orderId, sender_id: user.id, sender_name: myName, text: text
    });
    if (error) throw error;
}

// ---------- admin ----------

export async function listUsers() {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((u) => ({
        id: u.id, fullName: u.full_name, email: u.email, role: u.role,
        status: u.status, createdAt: withMillis(u.created_at)
    }));
}

export async function setUserStatus(userId, status) {
    const { error } = await supabase.rpc("admin_set_user_status", { p_user: userId, p_status: status });
    if (error) throw error;
}
