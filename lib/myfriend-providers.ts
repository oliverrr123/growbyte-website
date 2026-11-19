import Stripe from "stripe";
import twilio from "twilio";

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function twilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_VERIFY_SERVICE_SID,
  );
}

export function twilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export function allowDevOtpBypass() {
  return process.env.NODE_ENV !== "production" && !twilioConfigured();
}
