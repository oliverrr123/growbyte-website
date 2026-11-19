"use client";

import Image from "next/image";

function ReviewPreview() {
  const reviews = [
    { name: "Sarah K.", portrait: "casual-parent-woman", quote: "Mum likes having someone to chat with when the house is quiet. She just picks up the phone." },
    { name: "Daniel R.", portrait: "casual-parent-man", quote: "Dad wanted to try AI, but apps put him off. Calling a number felt familiar straight away." },
    { name: "Helen W.", portrait: "casual-senior-woman", quote: "Sometimes I call with a question and end up having a lovely little chat." },
    { name: "Orla B.", portrait: "casual-parent-woman-r4", quote: "The short updates give me something to ask Mum about when we talk later." },
    { name: "Ravi S.", portrait: "casual-parent-man-r5", quote: "I still call Dad myself. This is just a bit of extra company between our conversations." },
  ];

  return (
    <section className="mf-local-reviews" aria-label="Fictional review preview">
      <div className="mf-testimonial-window" tabIndex={0} aria-label="Scroll through sample reviews">
        <div className="mf-testimonial-track">
          {[0, 1].map(copy => <div className="mf-testimonial-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {reviews.map((review, index) => (
          <figure className="mf-customer-review" key={index}>
            <blockquote>“{review.quote}”</blockquote>
            <figcaption>
              <Image src={`/images/robo-companion/figma-refresh/avatars/${review.portrait}.png`} alt="" width={48} height={48} sizes="48px" loading="eager" className="mf-local-review-portrait" />
              <strong>{review.name}</strong>
            </figcaption>
          </figure>
        ))}
          </div>)}
        </div>
      </div>
    </section>
  );
}

export function MyFriendTestimonials() {
  return (
    <div className="mf-testimonials">
      <ReviewPreview />
    </div>
  );
}
