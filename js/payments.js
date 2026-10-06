/* PakGig — Online payment (Safepay) helper
   Step 1: create_online_order makes an order that is waiting for payment.
   Step 2: the safepay-checkout Edge Function asks Safepay for a payment page link.
   The buyer is then sent to that Safepay page. When Safepay confirms the payment,
   the safepay-webhook function marks the order as paid and puts the money in escrow. */
import { supabase } from "./supabaseClient.js";

export async function startOnlinePayment(gigId) {
    const { data: orderId, error } = await supabase.rpc("create_online_order", { p_gig_id: gigId });
    if (error) throw error;

    const { data, error: fnError } = await supabase.functions.invoke("safepay-checkout", {
        body: { order_id: orderId }
    });
    if (fnError || !data || !data.url) throw (fnError || new Error("payment_init_failed"));
    return data.url;
}
