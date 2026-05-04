import Image from "next/image";

export const Testimonial = ({
    text,
    name,
    company,
    companyUrl,
    profilePictureUrl
}: {
    text: string;
    name: string;
    company: string;
    companyUrl: string;
    profilePictureUrl: string;
}) => {
    return (
        <div className="border border-foreground/10 px-6 py-5 my-8">
        <p className="italic mb-4">
          {text}
        </p>
        <div className="flex items-center gap-3">
          <Image
            src={profilePictureUrl}
            alt=""
            width={100}
            height={100}
            className="rounded-full w-11 h-11 aspect-square object-cover bg-foreground/10"
          />
          <div>
            <p className="text-sm">{name}</p>
            <p className="text-sm text-foreground/60">
              <a
                href={companyUrl}
                target="_blank"
                className="underline decoration-foreground/60"
              >
                {company}
              </a>
            </p>
          </div>
        </div>
      </div>
    )
}