import Image from "next/image";

export default function Home() {
  let skills: { title: string; description: string; image: string; alt: string; link: string; }[] = [
      {
          title: 'Custom solutions',
          description: 'From building fun websites for myself to creating complex systems for companies, I have the skills to create pretty much any site you could imagine.',
          // image: 'growbyte-website-screenshot.png',
          image: 'gradient-1.jpg',
          alt: 'Screenshot of a website I built for GrowByte company',
          link: 'web-development',
      },
      {
          title: 'Saas apps',
          description: 'My hobby of filming cars grew into a whole production company making marketing videos, music clips, car edits, or other videos & photos of any kind.',
          // image: 'music-video-screenshot.png',
          image: 'gradient-2.jpg',
          alt: 'Screenshot of a music video I produced for Mark Steiner',
          link: 'media-production',
      },
      {
          title: 'Healthcare robot',
          description: 'Since IT education in traditional schools is usually very poor, I decided to make fun workshops for children in elementary schools. I also teach teachers or whole companies.',
          // image: 'it-education-workshop.png',
          image: 'gradient-3.jpg',
          alt: 'Picture from my IT education workshop',
          link: 'it-education',
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
