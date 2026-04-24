import Image from "next/image";
import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";

export function MarketingAnalyzerArticle() {
  return (
    <>
      <p>
        <a href="https://marketup.eu" target="_blank" className="underline">
          MarketUp
        </a>
        , a major marketing agency in Prague, used to compare their client's vs
        competitor's ads manually. Going through the{" "}
        <a
          href="https://www.facebook.com/ads/library/"
          target="_blank"
          className="underline"
        >
          Meta Ad Library
        </a>{" "}
        and comparing every ad manually is not only very time consuming, but
        also lacks context. What if I they wanted to compare the average reach
        of all the active ads in the last month specifically on Instagram? They
        would have to go thorugh every ad manually and copy paste the reach
        into some spreadsheet and then generate a graph from it.
        <br />
        That just doesn't make sense.
        <br />
        <br />
        That's why we built a tool that takes all the hassle away and just lets
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
        suggestion? Make more video ads!
        <br />
        The AI analysis can also spot insightful patterns - is your competitor
        running ads for longer periods of time? Are they focusing on a specific
        product or running a special limited time offer?
        <br />
        After you're done with observing the data, you can export it with all
        the graphs and insights into a pdf report and share it directly with
        your client.
        <br />
        <br />
        Thanks to this system, MarketUp now saves time and focuses on the
        actually important part of their job, instead of wasting time on
        spreadsheets. They also provide added value for their clients by giving
        them access to this tool, so they can see for themselves how their ads
        are performing compared to their competition.
      </p>
      <div className="border border-foreground/10 px-6 py-5 my-8">
        <p className="italic mb-4">
          "Oliver delivered exactly what we needed — a tool that lets us stop wasting time gathering data and start uncovering valuable insights instead.
          What used to take hours of manual work in public ads libraries now happens in minutes with AI-generated analysis.
          Oliver was a pleasure to work with: responsive, technically sharp, and always focused on delivering real value."
        </p>
        <div className="flex items-center gap-3">
          <Image
            src="/images/case-studies/radek-stepan-profile-picture.jpg"
            alt=""
            width={100}
            height={100}
            className="rounded-full w-11 h-11 aspect-square object-cover bg-foreground/10"
          />
          <div>
            <p className="text-sm">Radek Štěpán</p>
            <p className="text-sm text-foreground/60">
              {/* Position at{" "} */}
              <a
                href="https://marketup.eu"
                target="_blank"
                className="underline decoration-foreground/60"
              >
                MarketUp
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mb-16">
        <p>Want to level up your company just like MarketUp? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>
          If you're unsure what to send, just say "hey", I'll get back to you ;)
          <br />
          You can call any time. If I don't pick up, I'll call you back.
        </p>
      </div>
    </>
  );
}

export function CvSearchEngineArticle() {
  return (
    <>
      <p>
        We built an internal AI search system that helps recruiters find top
        candidates in seconds across 50,000 CV documents. Instead of manually
        opening files and searching for keywords, the team now asks
        natural-language queries and gets ranked, relevant profiles instantly.
      </p>
      <p>
        The workflow combines semantic search, structured filters, and
        human-readable candidate summaries. Recruiters can narrow results by
        seniority, stack, location, and domain expertise while still preserving
        context from each CV.
      </p>
      <p>
        This reduced the first-pass screening time significantly and improved
        candidate relevance in shortlists. The team spends less time on
        document triage and more time evaluating fit and running better
        interviews.
      </p>
      <div className="mb-16">
        <p>Want to level up your hiring workflow like this? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>If you're unsure what to send, just say "hey" and I'll get back to you.</p>
      </div>
    </>
  );
}
