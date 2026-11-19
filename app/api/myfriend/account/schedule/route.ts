import { dashboardAccount, sameOrigin } from "@/lib/myfriend-dashboard-auth";
import { jsonError } from "@/lib/myfriend";
import { defaultCheckinSchedule, validateCheckinSchedule, scheduleTime, WEEKDAYS } from "@/lib/myfriend-checkin-schedule";
import { apiErrorResponse, myfriendApi } from "@/lib/myfriend-api";
export const runtime = "nodejs";

export async function GET() {
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to view your schedule.", 401);
	const result = await myfriendApi<{ proposed_schedule: unknown; confirmed: boolean; timezone:string|null; calling_preferences:Array<{weekdays:string;hour_range_from:string;hour_range_to:string}> }>("/api/account/friendly-calls", { query: { buyer_phone: account.buyer_phone_number } });
	if (!result.ok) return apiErrorResponse(result);
	const proposal = result.data.proposed_schedule ? validateCheckinSchedule(result.data.proposed_schedule) : null;
	const fallback = proposal && "schedule" in proposal && proposal.schedule ? proposal.schedule : defaultCheckinSchedule();
	const confirmedRows = result.data.confirmed ? result.data.calling_preferences : [];
	const confirmedDays = confirmedRows.flatMap(row=>row.weekdays.split(",").map(Number));
	const confirmedSchedule = confirmedRows.length ? validateCheckinSchedule({
		enabled: true,
		frequency: confirmedRows.length > 1 ? "multiple" : new Set(confirmedDays).size === 7 ? "daily" : "weekly",
		weekdays: confirmedDays,
		windows: confirmedRows.map(row=>({start:toMinutes(row.hour_range_from),end:toMinutes(row.hour_range_to)})),
		timezone: result.data.timezone || fallback.timezone,
	}) : null;
	const parsed = confirmedSchedule && !confirmedSchedule.error ? confirmedSchedule : proposal;
	const confirmedSummary = confirmedRows.map(row => {
		const days = [...new Set(row.weekdays.split(",").map(Number))];
		return `${days.length === 7 ? "Every day" : WEEKDAYS.filter(day=>days.includes(day.value)).map(day=>day.label).join(", ")} · ${scheduleTime(toMinutes(row.hour_range_from))}–${scheduleTime(toMinutes(row.hour_range_to))}`;
	}).join("; ");
	return Response.json({ schedule: parsed && !parsed.error ? parsed.schedule : defaultCheckinSchedule(), saved: Boolean(parsed && !parsed.error), active: result.data.confirmed, confirmed_summary: confirmedSummary, confirmed_timezone: result.data.timezone });
}

function toMinutes(value:string) {
	const [hour,minute]=value.split(":").map(Number);
	return hour*60+minute;
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return jsonError("Invalid request origin.", 403);
  const account = await dashboardAccount();
  if (!account) return jsonError("Please log in to change your schedule.", 401);
  const body = await request.json().catch(()=>null);
  const parsed = validateCheckinSchedule(body);
  if (body?.digest_timezone !== undefined) {
    if(typeof body.digest_timezone !== "string") return jsonError("Choose a valid timezone for daily updates.");
    try { new Intl.DateTimeFormat("en",{timeZone:body.digest_timezone}).format(); }
    catch { return jsonError("Choose a valid timezone for daily updates."); }
  }
  if (parsed.error || !parsed.schedule) return jsonError(parsed.error || "Invalid schedule.");
	const result = await myfriendApi<{ ok: boolean }>("/api/account/friendly-calls", { method: "POST", body: { buyer_phone: account.buyer_phone_number, schedule: parsed.schedule, digest_timezone: body?.digest_timezone } });
	if (!result.ok) return apiErrorResponse(result);
  return Response.json({ schedule: parsed.schedule, saved: true, active: false });
}
