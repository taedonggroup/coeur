type Props = {
  tagline: string;
  copyrightTemplate: string;
};

export function Footer({ tagline, copyrightTemplate }: Props) {
  const copyright = copyrightTemplate.replace(
    "{year}",
    String(new Date().getFullYear()),
  );
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-white/50">
        <p className="whitespace-pre-line">{copyright}</p>
        <p className="font-display italic tracking-wide whitespace-pre-line">
          {tagline}
        </p>
      </div>
    </footer>
  );
}
