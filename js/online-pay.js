/* PakGig — adds a "Pay online with Safepay" button to the order popup on Services.html.
   The old manual deposit form stays below it as a fallback. */
import { startOnlinePayment } from "./payments.js";

let selectedGigId = null;

const grid = document.getElementById("servicesGrid");
const form = document.getElementById("escrowPaymentForm");

if (grid && form) {
    grid.addEventListener("click", (e) => {
        const btn = e.target.closest(".orderGigBtn");
        if (btn) selectedGigId = btn.dataset.gig;
    });

    const box = document.createElement("div");
    box.style.cssText = "margin-bottom:16px; padding:14px; border:1px solid #a7f3d0; background:#ecfdf5; border-radius:10px; text-align:center;";
    box.innerHTML =
        '<p style="margin:0 0 10px 0; font-size:13px; color:#065f46;">Seedha online pay karein — payment escrow mein mehfooz rahegi.</p>' +
        '<button type="button" id="payOnlineBtn" style="width:100%; background:#047857; color:#fff; padding:11px 15px; border:none; border-radius:8px; font-weight:bold; font-size:14px; cursor:pointer;">Pay Online with Safepay (Test Mode)</button>' +
        '<p id="payOnlineMsg" style="display:none; margin:10px 0 0 0; font-size:12px; color:#991b1b;"></p>' +
        '<p style="margin:12px 0 0 0; font-size:11px; color:#6b7280;">Ya neeche manual deposit form use karein.</p>';
    form.parentNode.insertBefore(box, form);

    const payBtn = box.querySelector("#payOnlineBtn");
    const msg = box.querySelector("#payOnlineMsg");

    payBtn.addEventListener("click", async () => {
        if (!selectedGigId) return;
        msg.style.display = "none";
        payBtn.disabled = true;
        payBtn.textContent = "Safepay khul raha hai...";
        try {
            const url = await startOnlinePayment(selectedGigId);
            window.location.href = url;
        } catch (err) {
            console.error(err);
            msg.textContent = "Online payment shuru nahi ho saki. Dobara koshish karein ya manual deposit use karein.";
            msg.style.display = "block";
            payBtn.disabled = false;
            payBtn.textContent = "Pay Online with Safepay (Test Mode)";
        }
    });
}
