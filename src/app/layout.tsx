import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

/* Plus Jakarta Sans carries the display type; Inter carries body and UI —
   self-hosted via next/font instead of a Google Fonts <link>. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap'
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  /* Italic is loaded as a real cut — the hero headline sets its accent
     phrase in italic, and a synthesised slant looks wrong at display size. */
  style: ['normal', 'italic'],
  variable: '--font-plus-jakarta',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Prospectra.ai — Find every lead. Enrich every row. Call every prospect.',
  description:
    'Scrape live business and job data, enrich it in a reactive table, then reach out with AI voice agents and email — all from one workspace.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
