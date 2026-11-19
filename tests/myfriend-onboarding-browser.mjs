import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.ONBOARDING_UI_BASE || "http://localhost:3000";

(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  let paid = false;
  let stage = "buyer";
  let failCode = true;
  let failCheckout = true;
  const actions = [];

  await page.route("**/api/myfriend/onboarding", async (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({ json: { paid, stage } });
    }
    const body = route.request().postDataJSON();
    actions.push(body);
    if (body.action === "checkout") {
      if (failCheckout) {
        failCheckout = false;
        return route.fulfill({
          status: 503,
          json: { error: "Checkout temporarily unavailable." },
        });
      }
      paid = true;
      return route.fulfill({
        json: { url: "/myfriend/onboarding?setup=1" },
      });
    }
    stage =
      {
        buyer: "senior",
        senior: "email",
        "skip-senior": "email",
        email: "welcome",
        finish: "done",
      }[body.action] || stage;
    return route.fulfill({ json: { ok: true } });
  });

  await page.route("**/api/myfriend/verify/send", (route) =>
    route.fulfill({
      json: { phone: route.request().postDataJSON().phone },
    }),
  );
  await page.route("**/api/myfriend/verify/check", (route) => {
    if (failCode) {
      failCode = false;
      return route.fulfill({
        status: 400,
        json: { error: "That code didn’t match." },
      });
    }
    return route.fulfill({ json: { ok: true } });
  });

  async function noHorizontalOverflow(label) {
    const overflowing = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflowing, false, "horizontal overflow on " + label);
  }

  const heading = name => page.getByRole("heading", {name,exact:true}).waitFor();
  async function click(name) {
    await page.waitForFunction(() => document.querySelector('[data-testid="onboarding-content"]')?.getAttribute('data-transition-phase') === 'idle');
    if (name === "Back") await page.goBack();
    else await page.getByRole("button", {name,exact:true}).click();
  }
  await page.goto(base + "/myfriend/onboarding");
  await heading("Let’s make MyFriend personalized to your needs");
  assert.equal(await page.locator("[role=img][aria-label=MyFriend]").count(),1);
  assert.equal(await page.locator("a[aria-label=Back]").textContent(),"←");
  await noHorizontalOverflow("intro");
  await click("Let’s go");
  await heading("Who are you setting MyFriend up for?");
  await click("My grandma");
  await heading("How do you want MyFriend to help?");
  await click("Give her a companion she can call 24/7");
  await click("Remind her of important stuff like taking medications");
  assert.equal(await page.getByRole("heading", {name:"How do you want MyFriend to help?"}).count(),1);
  await click("Continue");
  await heading("MyFriend can:");
  await click("Continue");
  await heading("How old is your grandma?");
  await click("80-90");
  await heading("How close do you live to your grandma?");
  await click("Back");
  await heading("How old is your grandma?");
  assert.equal(await page.getByRole("button", {name:"80-90",exact:true}).getAttribute("aria-pressed"),"true");
  await click("Skip");
  await heading("How close do you live to your grandma?");
  await click("We live far apart");
  await heading("How often do you and your grandma talk when you’re apart?");
  await click("A few times a week");
  await heading("How often do you spend time with your grandma in person?");
  await click("A few times a month");
  await heading("You talk to grandma often. But you can’t always be there in person.");
  await page.reload();
  await heading("You talk to grandma often. But you can’t always be there in person.");
  await noHorizontalOverflow("reflection");
  await click("Continue");
  await heading("How does your grandma usually feel about technology?");
  await click("She mostly avoids it");
  await heading("No new technology to learn.");
  await click("Continue");
  await heading("What might your grandma want a little help remembering?");
  await click("Medication times");
  await click("Nothing specific right now");
  assert.equal(await page.getByRole("button",{name:"Medication times",exact:true}).getAttribute("aria-pressed"),"false");
  await click("Medication times");
  await click("Appointments and plans");
  assert.equal(await page.getByRole("button",{name:"Nothing specific right now",exact:true}).getAttribute("aria-pressed"),"false");
  await click("Continue");
  await heading("MyFriend can call her any time she needs.");
  await click("Continue");
  await heading("How often do you want MyFriend to check up on grandma?");
  await page.getByRole("button", {name: /^Every day$/}).click();
  await heading("Peace of mind");
  await click("Continue");
  await heading("Bringing the pieces together…");
  await heading("Your setup is ready!");
  await page.getByText("Check-in calls to grandma every day",{exact:true}).waitFor();
  await click("Continue");
  await heading("A 24/7 companion, for the price of one meal.");
  await click("Continue");
  await heading("Join 250+ happy users.");
  await page.getByRole("button",{name:"Continue with monthly",exact:true}).waitFor();
  await page.getByRole("button",{name:"Continue with annual",exact:true}).waitFor();
  await page.getByRole("checkbox").check();
  await noHorizontalOverflow("pricing");

  await page.getByRole("button", { name: "Continue with annual" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Checkout temporarily unavailable." })
    .waitFor();
  await page.getByRole("button", { name: "Continue with annual" }).click();

  await page
    .getByRole("heading", { name: "First, verify your phone." })
    .waitFor();
  assert.equal(await page.getByText(/daily reports/i).count(), 0);
  assert.equal(actions[0].plan, "annual");
  await page.getByLabel("Your phone number", { exact: true }).fill("+14155552671");
  await page.getByRole("button", { name: "Send verification code" }).click();
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByRole("button", { name: "Verify & continue" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "That code didn’t match." })
    .waitFor();
  await page.getByRole("button", { name: "Verify & continue" }).click();

  await page
    .getByRole("heading", { name: "Now ask your grandma to join you." })
    .waitFor();
  await page
    .getByText(/Ask your grandma if she’d like to try MyFriend/)
    .waitFor();
  await page.getByRole("button", { name: "Add her number later" }).click();
  await page.getByLabel("Email address").fill("buyer@example.com");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await page
    .getByRole("heading", {
      name: "Your grandma can meet MyFriend when she’s ready.",
    })
    .waitFor();
  await page.getByText(/call MyFriend for a gentle introduction/i).waitFor();
  await page.getByText(/decides whether friendly calls sound good/i).waitFor();
  await page
    .getByRole("link", { name: "Call MyFriend at +1 949 676 7670" })
    .waitFor();
  assert.ok(actions.some((action) => action.action === "skip-senior"));

  // Independently exercise the non-skipped loved-one verification path.
  stage = "senior";
  await page.reload();
  await page.getByLabel("Her phone number", { exact: true }).fill("+14155552672");
  await page.getByRole("button", { name: "Send verification code" }).click();
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByRole("button", { name: "Verify & continue" }).click();
  await page.getByRole("heading", { name: "Add a recovery email." }).waitFor();
  assert.ok(actions.some((action) => action.action === "senior"));

  // A corrupt late-stage draft rewinds to the first unanswered prerequisite.
  paid = false;
  await page.evaluate(() => {
    sessionStorage.setItem(
      "myfriend-loved-one-v4",
      JSON.stringify({
        version: 4,
        stepId: "pricing",
        answers: { habits: ["none", "medication", "medication"] },
        billingPlan: "annual",
      }),
    );
  });
  await page.goto(base + "/myfriend/onboarding");
  await page
    .getByRole("heading", { name: "Who are you setting MyFriend up for?" })
    .waitFor();

  const completeAnswers = {
    relationship:"grandmother",goals:["reminders","checkins"],age:"",distance:"together",
    remoteContact:"daily",physicalContact:"weekly",technology:"unsure",habits:["none"],
    cadence:"inbound-only",committed:false,
  };
  await page.evaluate(answers => { history.replaceState(null,"",location.href); sessionStorage.setItem("myfriend-loved-one-v4",JSON.stringify({version:4,stepId:"reflection",answers,billingPlan:"annual"})); },completeAnswers);
  await page.reload();
  await heading("You already check in on grandma. MyFriend can help with the reminders in between.");
  await page.emulateMedia({reducedMotion:"reduce"});
  await click("Continue");
  await heading("How does your grandma usually feel about technology?");
  assert.equal(await page.getByTestId("onboarding-content").getAttribute("data-transition-phase"),"idle");
  assert.equal(actions[0].answers.age, "");
  assert.equal(actions[0].answers.committed, false);
  assert.deepEqual(actions[0].answers.goals,["conversation","reminders"]);
  assert.deepEqual(errors, []);
  await browser.close();
  console.log("PASS: current Figma flow, optional age, multi-select, automatic advance, draft resume, reduced motion, pricing retry, saved answers, and account setup. External services mocked.");
})().catch(error => { console.error(error); process.exit(1); });
