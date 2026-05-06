import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { MuxVideo } from "@/components/mux-video";
import { Testimonial } from "@/components/testimonial";

export function MarketingAnalyzerArticleEn() {
  return (
    <>
      <p>
        <a href="https://marketup.eu" target="_blank" className="underline">
          MarketUp
        </a>
        {`, a major marketing agency in Prague, used to compare their client's vs
        competitor's ads manually. Going through the `}
        <a
          href="https://www.facebook.com/ads/library/"
          target="_blank"
          className="underline"
        >
          Meta Ad Library
        </a>
        {` and comparing every ad manually is not only very time consuming, but
        also lacks context. What if I they wanted to compare the average reach
        of all the active ads in the last month specifically on Instagram? They
        would have to go thorugh every ad manually and copy paste the reach
        into some spreadsheet and then generate a graph from it.`}
        <br />
        {`That just doesn't make sense.`}
        <br />
        <br />
        {`That's why we built a tool that takes all the hassle away and just lets
        you focus on the important stuff - actually reading and analysing the
        data, not just gathering it. You simply select the client and
        competitor pages that you want to compare (you can even select multiple
        of them!) and click analyze. The system pulls all the ads from Meta so
        you can instantly view and inspect them side by side. It also generates
        graphs, which let you easily see the reach and target groups across all
        ads, so you don't need to touch any spreadsheets. After about a minute,
        the AI analysis is completed and lets you see the actually important
        data - the trends, differences and suggestions for improvement. For
        example, you can see that your traditional carousel ads are at the
        median reach, but then there's one video ad with way bigger reach -
        suggestion? Make more video ads!`}
        <br />
        {`The AI analysis can also spot insightful patterns - is your competitor
        running ads for longer periods of time? Are they focusing on a specific
        product or running a special limited time offer?`}
        <br />
        {`After you're done with observing the data, you can export it with all
        the graphs and insights into a pdf report and share it directly with
        your client.`}
        <br />
        <br />
        {`Thanks to this system, MarketUp now saves time and focuses on the
        actually important part of their job, instead of wasting time on
        spreadsheets. They also provide added value for their clients by giving
        them access to this tool, so they can see for themselves how their ads
        are performing compared to their competition.`}
      </p>
      <Testimonial
        text={`"Oliver delivered exactly what we needed — a tool that lets us stop wasting time gathering data and start uncovering valuable insights instead.
          What used to take hours of manual work in public ads libraries now happens in minutes with AI-generated analysis.
          Oliver was a pleasure to work with: responsive, technically sharp, and always focused on delivering real value."`}
        name="Radek Štěpán"
        company="MarketUp"
        companyUrl="https://marketup.eu"
        profilePictureUrl="/images/case-studies/radek-stepan-profile-picture.jpg"
      />
      <div className="mb-16">
        <p>Want to level up your company just like MarketUp? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`If you're unsure what to send, just say "hey", I'll get back to you ;)`}
          <br />
          {`You can call any time. If I don't pick up, I'll call you back.`}
        </p>
      </div>
    </>
  );
}

export function CvSearchEngineArticleEn() {
  return (
    <>
      <p>
        Ever tried a chatbot on some website? It's shit, right? Well, it doesn't have to be. Before AI, website chatbots weren't quite popular, because they didn't work very well. They could only answer predefined questions and when you asked them something slightly different, they would just crumble. But now with AI, we can achieve true human-like support! (maybe even better than a human...)
      </p>
      <p>
        Imagine this. You go on a website and you want to find out the price of a specific service you're looking for. Instead of clicking through all the pages trying to manually find it, you notice a chatbot in the bottom right already suggesting your question! "What's the price of X?", so you click it, ask it what you're looking for, and it instantly gives you the price with the all necessary details. Then it suggests: "Would you like to book a quick call where we can discuss how we can further help you?", so you just pick a time and it's booked! All in a matter of seconds.
      </p>
      <p>
        Now imagine this on your website. Your visitors get all the information they need, you get less calls from them, and without lifting a finger, you get new leads and booked calls!
      </p>
      <p>
        You can watch this 40 second demo to see it in action:
      </p>

      <div className="my-6 w-full">
        <MuxVideo
          playbackId="JwfhdQQrUUQFeFPeD3SZ8S5oTyaek01j5b01A9qTjTpfQ"
          title="chatbot-demo"
          aspectRatio="1624 / 1080"
        />
      </div>

      <div className="mb-16">
        <p>Want this for your website? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`If you're unsure what to send, just say "hey" and I'll get back to you.`}
        </p>
      </div>
    </>
  );
}
