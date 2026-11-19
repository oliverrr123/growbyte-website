const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 const page=await browser.newPage();let sent=[];
 await page.route('**/api/myfriend/email-login/send',async route=>{const body=route.request().postDataJSON();sent.push(body);await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({email:body.email})});});
 await page.goto(process.env.CHECK_URL||'http://localhost:3019/myfriend/login',{waitUntil:'networkidle'});
 const email=page.getByRole('textbox',{name:'Email address'});
 assert.equal(await email.getAttribute('type'),'text');assert.equal(await email.getAttribute('autocorrect'),'on');assert.equal(await email.getAttribute('inputmode'),'email');assert.equal(await email.getAttribute('autocomplete'),'email');
 await email.fill('@@');await page.getByRole('button',{name:'Email me a code'}).click();await page.getByText('Enter a valid email address.',{exact:true}).waitFor();assert.equal(sent.length,0);
 await email.fill('test@example.com ');await page.getByRole('button',{name:'Email me a code'}).click();await page.getByText('Sent to test@example.com.',{exact:true}).waitFor();assert.deepEqual(sent,[{email:'test@example.com'}]);
 console.log('Editor attributes verified; invalid email rejected; trailing replacement space trimmed; mocked send reaches code screen. No email sent.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
