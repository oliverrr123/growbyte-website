import Image from "next/image";

export default function Home() {
  let skills: { title: string; description: string; image: string; alt: string; link: string; }[] = [
      {
          title: 'Custom solutions',
          description: 'Automate, save time and make more money with us. We build tailored solutions that automate your business processes.',
          // description: 'From building fun websites for myself to creating complex systems for companies, I have the skills to create pretty much any site you could imagine.',
          // image: 'growbyte-website-screenshot.png',
          image: 'gradient-1.jpg',
          alt: 'Screenshot of a website I built for GrowByte company',
          link: 'lets-talk',
      },
      {
          title: 'Saas apps',
          description: 'Tired of overpriced social media agencies? Try IG Byte, our AI-powered social media manager. Tired of employee scheduling? Try HR Byte, our AI-powered HR manager.',
          // image: 'music-video-screenshot.png',
          image: 'gradient-2.jpg',
          alt: 'Screenshot of a music video I produced for Mark Steiner',
          link: 'lets-talk',
      },
      {
          title: 'Healthcare robot',
          description: '16 200 000 senior people in the US live alone in a household (28% of the senior population). That\'s why we\'re building a robo-companion that can become their friend, help them with daily tasks and improve the quality of their lives.',
          // image: 'it-education-workshop.png',
          image: 'gradient-3.jpg',
          alt: 'Picture from my IT education workshop',
          link: 'lets-talk',
      }
  ]
  let projects: { title: string; image: string; alt: string; link: string; }[] = [
      {
          title: 'Luma production agency',
          // image: 'luma-production-website-screenshot.png',
          image: 'gradient-4.jpg',
          alt: 'Screenshot of a website I built for Luma production agency',
          link: 'https://luma-production.com/'
      },
      {
          title: 'SX Media - car photos & videos',
          // image: 'sx-media-website-screenshot.png',
          image: 'gradient-1.jpg',
          alt: 'Screenshot of a website I built for SX Media',
          link: 'https://sx-media.vercel.app/'
      },
      {
          title: 'GrowByte website',
          // image: 'growbyte-website-screenshot.png',
          image: 'gradient-2.jpg',
          alt: 'Screenshot of a website I built for Growbyte company',
          link: 'https://growbyte.co/'
      }
  ]

  return (
    <>

    <div className="flex w-full justify-center items-center pt-24 pb-6">
        <div className="w-48 h-48 bg-primary rounded-full"></div>
    </div>
    <div className="flex w-full justify-center items-center tracking-[-0.075em] pb-0.5">
      <h1 className="text-7xl font-black text-black">grow</h1>
      <h1 className="text-7xl font-black italic text-primary -ml-1.25">byte</h1>
    </div>
    <h3 className="text-center text-black text-opacity-80 text-lg font-light ml-16">~ Making you more money with <span className="font-semibold text-primary">AI</span></h3>
    <h2 className="text-3xl font-semibold text-center pt-24 pb-12">What do we build?</h2>
    <section className="w-full flex flex-col justify-center gap-20">
        {skills.map((skill) => (
            <div key={skill.title} className="flex flex-col gap-2">
                <Image src={`/images/${skill.image}`} alt={skill.alt} className="w-full rounded-xl" width={1000} height={1000} />
                <h3 className="text-black font-bold text-lg mt-2">{skill.title}</h3>
                <p className="text-black text-opacity-75 pb-1">{skill.description}</p>
                <a href={skill.link}><button className="font-semibold bg-black text-white cursor-pointer rounded-lg px-4 py-1.5">Find out more</button></a>
            </div>
        ))}
    </section>

    <footer>
        <div className="flex justify-center gap-4 pt-16">
            <a href="https://x.com/grow_byte" target="_blank" aria-label="Twitter profile"><Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
            <a href="https://linkedin.com/company/grow-byte" target="_blank" aria-label="Linkedin profile"><Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
            <a href="mailto:hello@growbyte.co" target="_blank" aria-label="Email"><Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
            <a href="tel:+14155056006" target="_blank" aria-label="Phone"><Image src="/icons/phone.svg" alt="Phone" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
        </div>
        <h6 className="py-6 text-center text-black">© 2025 GrowByte</h6>
    </footer>



{/* 
        Custom Solutions:

          Websites:

            SKO - https://sko.vercel.app
            Martin Krejčíř - Consultations - https://konzultace.vercel.app
            Martin Krejčíř - Business plan - https://martin-krejcir-business-plan.vercel.app
            Life Coach Luci Slavíková - https://lucislavikova.vercel.app

          AI Automations

            Automated Cold Outreach
            Automated Website Blogs
            Customer Support AI Chatbot

        IG Byte
          MVP: growbyte.cz

        HR Byte
          Design
*/}
    </>
  );
}
