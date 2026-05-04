import Image from "next/image";
import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { Testimonial } from "@/components/testimonial";

export function MarketingAnalyzerArticle() {
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

export function CvSearchEngineArticle() {
  return (
    <>
      <p>
        <a href="https://atollon.com" target="_blank" className="underline">Atollon</a>, a long established ERP software company in Prague asked us to build a tool for their client, that enables them to find the perfect job candidate in their database of 50 000+ CV documents. Without that tool, there was essentially no smart way to find anything. With thousands of CVs, each with a different format and structure, even a simple keyword search might be insufficient. We had to build a robust solution that could handle all of the possible CVs and provide a useful structured overview of each candidate.
      </p>
      <p>
        The first challenge was to somehow extract all of the data from the documents into a structured unified format. We needed to find a good OCR tool that could successfully parse even the weirdest PDFs. After some research and testing, we decided to use <a href="https://unstructured.io" target="_blank" className="underline">unstructured.io</a>, which performed best on the tests, and it's even open source, which let us host it on our servers to prevent any data leaks. After we extract the data, we also need to vectorize them, so they could be queried using semantic search.
      </p>
      <p>
        Next, the search engine. To correclty rank the candidates, we needed to use a combination of semantic search and structured filters (BM25). The semantic search was used to find the best matches for the search query, while the structured filters were used to narrow down the results to the most relevant candidates. I didn't tell you everything about the data extracting part though. Beside extracting and vectorizing the data, we also created a unified structured format for skills, education and past job experiences. AI takes the extracted text from the CV and maps it to this structured format, including a quick AI summary of the candidate. Only thanks to this, we could achieve peak performace.
      </p>
      <p>
        Thanks to this tool, Atollon's client can now search easily in natural language. For example, search <i>"senior python developer with 10+ years of experience in the fintech industry and a CS degree from MIT"</i> and the system will give them the perfect candidates ranked from best to worst. They can now focus on the acutally important stuff, instead of drowning in thousands of CVs.
      </p>
      
      <div className="mb-16">
        <p>Want to level up your processes just like Atollon's client? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`If you're unsure what to send, just say "hey" and I'll get back to you.`}
        </p>
      </div>
    </>
  );
}
