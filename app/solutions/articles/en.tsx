import { CaseStudyContactCopyButtons } from "@/components/case-study-contact-copy-buttons";
import { MuxVideo } from "@/components/mux-video";

export function ChatbotArticleEn() {
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

export function AutomailerArticleEn() {
  return (
    <>
      <p>
        Once I was hired by a company to automate their cold email outreach process. Their setup was a sales guy with a spreadsheet of leads, looking at each one's website, studying it, and then manually writing a personalized email for them. Does this sound like you? Well thank God you're reading this, because you won't have to do this anymore!
      </p>
      <p>
        Instead of doing all this manual work, our AI will do it for you. All you give it is a list of leads, a brief idea of what the email should communicate, and your target group. Wait, you don't have leads? No problem! Our AI can generate those for you, based on your target customer. Then you just say how many email per day you want to send, and boom, now you're sending hundreds of personalized emails every day, and you don't even have to do anything for it.
      </p>

      <div className="mb-16">
        <p>Ready to make your life easier? Call me or send me a message:</p>
        <CaseStudyContactCopyButtons />
        <p>
          {`If you're unsure what to send, just say "hey" and I'll get back to you.`}
        </p>
      </div>
    </>
  );
}
