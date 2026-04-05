import Image from "next/image";

type SiteLogoProps = {
  className?: string;
  dark?: boolean;
};

export function SiteLogo({ className = "h-10 w-[160px]", dark = false }: SiteLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/signature-logo.png"
        alt="handwritten signature logo"
        fill
        className={`object-contain ${dark ? "invert brightness-0" : ""}`}
        sizes="(max-width: 768px) 160px, 220px"
        priority
      />
    </div>
  );
}
