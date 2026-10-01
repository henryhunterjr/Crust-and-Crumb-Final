import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="glass-strong sheen max-w-xl w-full rounded-[34px] p-8 sm:p-12 text-center flex flex-col gap-5">
        <span className="eyebrow">404</span>
        <h1 className="font-display font-medium text-[40px] sm:text-[52px] leading-none tracking-[-0.03em] text-[#fff8ec]">
          That loaf didn&apos;t rise.
        </h1>
        <p className="text-[17px] leading-relaxed text-[rgba(246,236,220,0.82)]">
          We couldn&apos;t find that page. The term may have moved, or the link has a typo. Search the full glossary and you&apos;ll find it.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/" className="btn-gold h-12 px-6 rounded-full inline-flex items-center font-bold text-sm">
            Search the glossary
          </Link>
          <Link href="/#paths" className="btn-glass h-12 px-6 rounded-full inline-flex items-center font-semibold text-sm">
            Browse learning paths
          </Link>
        </div>
      </div>
    </main>
  );
}
