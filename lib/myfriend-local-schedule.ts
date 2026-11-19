import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { MyFriendAccount } from "./myfriend-api";
import { validateCheckinSchedule, type CheckinSchedule } from "./myfriend-checkin-schedule";

// Local design/testing persistence only. Never activate the shared call scheduler.
function accountPath(account: MyFriendAccount) {
  if (process.env.NODE_ENV !== "development") throw new Error("Local schedules are only available in development.");
  const identity = account.stripe_customer_id || account.email?.trim().toLowerCase();
  if (!identity) throw new Error("An account email is required to save a schedule.");
  const key = createHash("sha256").update(identity).digest("hex");
  return path.join(process.cwd(), ".local", "myfriend-schedules", `${key}.json`);
}
export async function readLocalSchedule(account: MyFriendAccount): Promise<CheckinSchedule | null> {
  try {
    const parsed = validateCheckinSchedule(JSON.parse(await readFile(accountPath(account), "utf8")));
    if (parsed.error) throw new Error("Saved schedule could not be read.");
    return parsed.schedule!;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
export async function writeLocalSchedule(account: MyFriendAccount, schedule: CheckinSchedule) {
  const file = accountPath(account);
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(schedule), { mode: 0o600 });
    await rename(temporary, file);
  } finally { await unlink(temporary).catch(()=>{}); }
}
