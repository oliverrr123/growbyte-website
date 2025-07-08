import Image from "next/image";

export default function LetsTalk() {
    return (
        <div className="overflow-hidden fixed inset-0">
            <div className="flex flex-col items-center justify-center h-[calc(100dvh-2rem)] gap-12">
                <div className="flex flex-col items-center justify-center gap-3">
                    <h1 className="text-4xl font-bold">Let's grab a coffee</h1>
                    <p className="text-lg">San Francisco, CA</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-[1px] w-10 bg-black"></div>
                    <p className="text-lg">OR</p>
                    <div className="h-[1px] w-10 bg-black"></div>
                </div>
                <div className="flex justify-center gap-4">
                <a href="https://x.com/grow_byte" target="_blank" aria-label="Twitter profile"><Image src="/icons/twitter-x.svg" alt="Twitter" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
                <a href="https://linkedin.com/company/grow-byte" target="_blank" aria-label="Linkedin profile"><Image src="/icons/linkedin.svg" alt="LinkedIn" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
                <a href="mailto:hello@growbyte.co" target="_blank" aria-label="Email"><Image src="/icons/mail.svg" alt="Email" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
                <a href="tel:+14155056006" target="_blank" aria-label="Phone"><Image src="/icons/phone.svg" alt="Phone" className="w-8 h-8 hover:opacity-100 transition-opacity" width={32} height={32} /></a>
            </div>
            </div>
        </div>
    )
}