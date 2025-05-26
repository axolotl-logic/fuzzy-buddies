import Link from "next/link";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-amber-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">🦝</span>
            </div>
          </div>
          <span className="text-xl font-bold text-amber-700">
            Fuzzy Buddies
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-4"></nav>
      </div>
    </header>
  );
}
