export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-white/50">
        <p>© {new Date().getFullYear()} Coeur Studio. All rights reserved.</p>
        <p className="font-display italic tracking-wide">
          공간의 마음을 디자인합니다.
        </p>
      </div>
    </footer>
  );
}
