import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full mt-24 px-12">
        <Image src="/growbyte-logo.png" alt="logo" width={400} height={400} />
        <h2 className="text-lg">Making you more money with <span className="font-semibold text-primary">AI</span></h2>
      </div>
      <div className="flex flex-col w-full mt-24 gap-16">
        <h3 className="text-3xl font-black text-center">Custom Solutions</h3>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Image src="/gradient-1.jpg" alt="website" className="rounded-lg w-full" width={1000} height={1000} />
            <h2 className="text-2xl font-bold">Websites</h2>
            <ul className="list-disc list-inside">
              <li><a href="https://sko.vercel.app" className="text-primary">SKO</a></li>
              <li><a href="https://konzultace.vercel.app" className="text-primary">Martin Krejčíř - Consultations</a></li>
              <li><a href="https://martin-krejcir-business-plan.vercel.app" className="text-primary">Martin Krejčíř - Business plan</a></li>
              <li><a href="https://lucislavikova.vercel.app" className="text-primary">Life Coach Luci Slavíková</a></li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <Image src="/gradient-2.jpg" alt="website" className="rounded-lg w-full" width={1000} height={1000} />
            <h2 className="text-2xl font-bold">AI Automations</h2>
            <ul className="list-disc list-inside">
              <li><a href="https://sko.vercel.app">Automated Cold Outreach</a></li>
              <li><a href="https://konzultace.vercel.app">Automated Website Blogs</a></li>
              <li><a href="https://martin-krejcir-business-plan.vercel.app">Customer Support AI Chatbot</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col w-full mt-8 gap-8">
          <h3 className="text-3xl font-black text-center">Apps</h3>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Image src="/gradient-3.jpg" alt="website" className="rounded-lg w-full" width={1000} height={1000} />
              <h2 className="text-2xl font-bold">IG Byte</h2>
              <p>MVP: <a className="text-primary" href="https://growbyte.cz">growbyte.cz</a></p>
            </div>
            <div className="flex flex-col gap-2">
              <Image src="/gradient-4.jpg" alt="website" className="rounded-lg w-full" width={1000} height={1000} />
              <h2 className="text-2xl font-bold">HR Byte</h2>
              <p>Design</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm opacity-75 mt-12">&copy; 2025 GrowByte</p>
    </div>
  );
}
