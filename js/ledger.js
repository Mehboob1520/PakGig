/* PakGig — Ledger / calculation helpers
   Used by dashboard, order, admin pages for totals and status formatting. */

// Platform fee kept from every completed order (8%).
// Keep this in sync with the database function request_withdrawal (uses 0.08).
export const PLATFORM_FEE_RATE = 0.08;

export const CATEGORIES = {
    web: "Web & App Development",
    design: "Graphics & Design",
    seo: "Digital Marketing"
};

export const STATUS_META = {
    pending: { label: "Pending", badge: "bg-yellow-50 border-yellow-200 text-yellow-800" },
    in_progress: { label: "In Progress", badge: "bg-blue-50 border-blue-200 text-blue-800" },
    delivered: { label: "Delivered", badge: "bg-purple-50 border-purple-200 text-purple-800" },
    completed: { label: "Completed", badge: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    cancelled: { label: "Cancelled", badge: "bg-red-50 border-red-200 text-red-800" },
    disputed: { label: "Disputed", badge: "bg-orange-50 border-orange-200 text-orange-800" }
};

export function money(n) {
    return "PKR " + Number(n || 0).toLocaleString();
}

export function esc(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
}

export function roleIn(order, userId) {
    return userId === order.sellerId ? "seller" : "buyer";
}

// What the seller keeps from an order after the platform fee.
export function sellerNet(amount) {
    const a = Number(amount) || 0;
    return a - Math.round(a * PLATFORM_FEE_RATE);
}

export function sellerTotals(orders, withdrawals, sellerId) {
    const completed = orders
        .filter((o) => o.sellerId === sellerId && o.status === "completed")
        .reduce((sum, o) => sum + sellerNet(o.amount), 0);

    const withdrawn = withdrawals
        .filter((w) => w.sellerId === sellerId && w.status === "paid")
        .reduce((sum, w) => sum + Number(w.amount), 0);

    const pending = orders
        .filter((o) => o.sellerId === sellerId && ["pending", "in_progress", "delivered"].includes(o.status))
        .reduce((sum, o) => sum + sellerNet(o.amount), 0);

    return {
        completed,
        withdrawn,
        pending,
        held: pending,
        available: completed - withdrawn
    };
}

export function buyerHeld(orders, buyerId) {
    return orders
        .filter((o) => o.buyerId === buyerId && ["pending", "in_progress", "delivered"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.amount), 0);
}

export function formatDueText(order) {
    if (!order) return "—";
    if (order.due) return order.due;
    return "N/A";
}

export default {
    PLATFORM_FEE_RATE,
    CATEGORIES,
    STATUS_META,
    money,
    esc,
    roleIn,
    sellerNet,
    sellerTotals,
    buyerHeld,
    formatDueText
};

window.PakGig = window.PakGig || {};
window.PakGig.ledger = {
    PLATFORM_FEE_RATE,
    CATEGORIES,
    STATUS_META,
    money,
    esc,
    roleIn,
    sellerNet,
    sellerTotals,
    buyerHeld,
    formatDueText
};
