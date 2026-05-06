'use client';

import { type ReactNode, useEffect, useRef } from 'react';

export function SourceDisclosure({ children }: { children: ReactNode }) {
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function openForSourceHash() {
      const targetId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
      if (!targetId || (targetId !== 'sources' && !targetId.startsWith('source-'))) return;

      const disclosure = disclosureRef.current;
      if (!disclosure) return;

      disclosure.open = true;
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
      });
    }

    openForSourceHash();
    window.addEventListener('hashchange', openForSourceHash);
    return () => window.removeEventListener('hashchange', openForSourceHash);
  }, []);

  return (
    <details className="sources-disclosure" ref={disclosureRef}>
      <summary id="sources">
        <span className="sources-disclosure-title" role="heading" aria-level={2}>Sources</span>
        <span className="sources-disclosure-hint" aria-hidden="true">Source list</span>
      </summary>
      <div className="sources-disclosure-body">{children}</div>
    </details>
  );
}
