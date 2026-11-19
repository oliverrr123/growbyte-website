import { jsonError, myfriendLineFor } from "@/lib/myfriend";
import { stripeClient, twilioClient } from "@/lib/myfriend-providers";

export async function POST(request: Request) {
  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Missing checkout session.");
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId) return jsonError("Missing checkout session.");

  const stripe = stripeClient();
  if (!stripe) return jsonError("Checkout isn't set up yet.", 503);

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.status !== "complete" || session.payment_status === "unpaid") {
    return jsonError("Payment isn't finished yet.", 402);
  }

  const phone = session.metadata?.phone;
  if (!phone) return jsonError("No phone number on this order.", 400);

  const line = myfriendLineFor(phone);
  const from = line.e164;
  const client = twilioClient();
  if (!client) {
    return jsonError("Calling out isn't set up yet. Call the number on screen instead.", 503);
  }

  try {
    await client.calls.create({
      to: phone,
      from,
      twiml: `<Response>
        <Pause length="1"/>
        <Say voice="Polly.Joanna">Hi, this is MyFriend. Connecting you now.</Say>
        <Dial callerId="${from}">${line.e164}</Dial>
      </Response>`,
    });
  } catch (error) {
    console.error("Twilio outbound call failed", error);
    return jsonError("Couldn't place the call. Try calling the number on screen.", 502);
  }

  return Response.json({ ok: true });
}
