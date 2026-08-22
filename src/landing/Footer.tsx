import { BRAND } from './brand';
import { Button, GradientField, Logomark, Pill } from './primitives';
import { useGsap, revealOnScroll } from './motion';

const COLUMNS = [
  {
    title: 'Product',
    links: ['Lead discovery', 'Enrichment', 'Voice agents', 'Campaigns', 'Analytics']
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Customers', 'Security', 'Contact']
  },
  {
    title: 'Resources',
    links: ['Docs', 'API reference', 'Changelog', 'Status', 'Community']
  }
];

export function Footer({ onLaunch }: { onLaunch: () => void }) {
  const scope = useGsap(({ scope: el, reduced }) => {
    revealOnScroll(el.querySelectorAll('.lp-reveal'), { trigger: el, reduced });
  }, []);

  return (
    <footer ref={scope}>
      {/* ---------------- Closing CTA ---------------- */}
      <div className="lp-shell" style={{ paddingBottom: 'clamp(4rem, 8vw, 6rem)' }}>
        <div className="lp-cta lp-reveal">
          <GradientField />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Pill dot>Free while you evaluate</Pill>
            <h2
              className="lp-h2 lp-balance"
              style={{ maxWidth: '17ch', marginInline: 'auto', marginTop: '1.25rem' }}
            >
              Your next customer is already in a table you have not built yet
            </h2>
            <p
              className="lp-lead lp-balance"
              style={{ maxWidth: '52ch', marginInline: 'auto', marginTop: '1rem' }}
            >
              Start with 500 free enrichment credits and a live voice agent. No card, no
              sales call to unlock it.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              <Button chip onClick={onLaunch}>
                Start Prospecting Free
              </Button>
              <Button variant="ghost" onClick={onLaunch}>
                Talk to the team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Footer ---------------- */}
      <div className="lp-footer">
        <div className="lp-shell">
          <div className="lp-footer__grid lp-reveal">
            <div className="lp-footer__col">
              <a className="lp-logo" href="#home" style={{ marginBottom: 14 }}>
                <Logomark />
                {BRAND.name}
                <span className="lp-logo__suffix">{BRAND.suffix}</span>
              </a>
              <p
                className="lp-body"
                style={{ fontSize: 'var(--lp-t-sm)', maxWidth: '34ch', marginTop: 12 }}
              >
                {BRAND.tagline}
              </p>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title} className="lp-footer__col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#home">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lp-footer__base">
            <span>
              © {new Date().getFullYear()} {BRAND.name}
              {BRAND.suffix} — {BRAND.domain}
            </span>
            <span style={{ display: 'flex', gap: 20 }}>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                Privacy
              </a>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                Terms
              </a>
              <a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>
                DPA
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
