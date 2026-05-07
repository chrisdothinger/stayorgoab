import type { ReactNode } from 'react';

import { SourceDisclosure } from '@/components/SourceDisclosure';

function lineToId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type Block = {
  text: string;
  inSources: boolean;
};

function sourceHref(sourceNumber: string): string {
  return `#source-${sourceNumber}`;
}

function renderSourceLinks(numbers: string[], keyPrefix: string) {
  return numbers.map((sourceNumber, index) => (
    <a className="citation-link" href={sourceHref(sourceNumber)} key={`${keyPrefix}-${sourceNumber}-${index}`}>
      [{sourceNumber}]
    </a>
  ));
}

function renderCitationCluster(citationText: string, keyPrefix: string): ReactNode {
  const numbers = Array.from(citationText.matchAll(/\[(\d+)\]/g), (match) => match[1]);

  if (numbers.length >= 3) {
    return (
      <details className="evidence-chip" key={`${keyPrefix}-evidence`}>
        <summary aria-label={`Show ${numbers.length} source links for this claim`}>
          {numbers.length} sources
        </summary>
        <span className="evidence-chip-links" aria-label="Evidence source links">
          {renderSourceLinks(numbers, `${keyPrefix}-source`)}
        </span>
      </details>
    );
  }

  return <span className="citation-cluster" key={`${keyPrefix}-citations`}>{renderSourceLinks(numbers, `${keyPrefix}-source`)}</span>;
}

function renderCitations(text: string, keyPrefix: string) {
  const citationCluster = /(\[\d+\](?:(?:\s*,\s*|\s+|(?=\[\d+\]))\[\d+\])*)/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let clusterIndex = 0;

  for (const match of text.matchAll(citationCluster)) {
    const citationText = match[0];
    const start = match.index ?? 0;
    const numbers = citationText.match(/\[\d+\]/g) ?? [];

    if (start > cursor) parts.push(text.slice(cursor, start));

    if (numbers.length > 0) {
      parts.push(renderCitationCluster(citationText, `${keyPrefix}-cluster-${clusterIndex}`));
      clusterIndex += 1;
    } else {
      parts.push(citationText);
    }

    cursor = start + citationText.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return parts.map((part, index) => {
    if (typeof part !== 'string') return part;
    const isSourceTag = /^\[[a-z0-9.,\-\s]+\]$/i.test(part) && part.includes('-');
    return isSourceTag ? <code key={`${keyPrefix}-code-${index}`}>{part}</code> : part;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const strongText = part.slice(2, -2);
      if (containsEvidenceChip(strongText)) return renderCitations(strongText, `strong-${index}`);
      return <strong key={`strong-${index}`}>{renderCitations(strongText, `strong-${index}`)}</strong>;
    }
    return renderCitations(part, `text-${index}`);
  });
}

function getBlocks(body: string): Block[] {
  let inSources = false;
  return body.split(/\n{2,}/).filter(Boolean).map((text) => {
    const trimmed = text.trim();
    if (/^##\s+Sources\s*$/i.test(trimmed)) {
      inSources = true;
    } else if (/^##\s+/.test(trimmed)) {
      inSources = false;
    }
    return { text, inSources };
  });
}

function containsEvidenceChip(text: string) {
  return /\[\d+\](?:(?:\s*,\s*|\s+|(?=\[\d+\]))\[\d+\]){2,}/.test(text);
}

function renderBlock(block: Block, index: number) {
  if (block.text.startsWith('### ')) {
    const text = block.text.replace(/^###\s+/, '');
    return <h3 id={lineToId(text)} key={index}>{text}</h3>;
  }
  if (block.text.startsWith('## ')) {
    const text = block.text.replace(/^##\s+/, '');
    return <h2 id={lineToId(text)} key={index}>{text}</h2>;
  }
  if (block.text.startsWith('# ')) {
    const text = block.text.replace(/^#\s+/, '');
    return <h1 key={index}>{text}</h1>;
  }
  if (/^-\s+/m.test(block.text)) {
    const items = block.text.split('\n').filter((line) => line.trim().startsWith('- '));
    return (
      <ul key={index}>
        {items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item.replace(/^\s*-\s+/, ''))}</li>)}
      </ul>
    );
  }
  if (/^\d+\.\s+/m.test(block.text)) {
    const items = block.text.split('\n').filter((line) => /^\s*\d+\.\s+/.test(line));
    return (
      <ol key={index}>
        {items.map((item, itemIndex) => {
          const sourceNumber = item.match(/^\s*(\d+)\.\s+/)?.[1];
          return (
            <li id={block.inSources && sourceNumber ? `source-${sourceNumber}` : undefined} key={itemIndex}>
              {renderInline(item.replace(/^\s*\d+\.\s+/, ''))}
            </li>
          );
        })}
      </ol>
    );
  }
  if (containsEvidenceChip(block.text)) {
    return <div className="paragraph" key={index}>{renderInline(block.text)}</div>;
  }
  return <p key={index}>{renderInline(block.text)}</p>;
}

export function MarkdownText({ body }: { body: string }) {
  const blocks = getBlocks(body);
  const sourcesIndex = blocks.findIndex((block) => /^##\s+Sources\s*$/i.test(block.text.trim()));
  const nextHeadingIndex = sourcesIndex >= 0
    ? blocks.findIndex((block, index) => index > sourcesIndex && /^##\s+/.test(block.text.trim()))
    : -1;
  const sourcesEndIndex = nextHeadingIndex >= 0 ? nextHeadingIndex : blocks.length;
  const bodyBlocks = sourcesIndex >= 0 ? blocks.slice(0, sourcesIndex) : blocks;
  const sourceBlocks = sourcesIndex >= 0 ? blocks.slice(sourcesIndex + 1, sourcesEndIndex) : [];
  const afterSourceBlocks = sourcesIndex >= 0 ? blocks.slice(sourcesEndIndex) : [];

  return (
    <div className="markdown">
      {bodyBlocks.map((block, index) => renderBlock(block, index))}
      {sourceBlocks.length > 0 ? (
        <SourceDisclosure>
          {sourceBlocks.map((block, index) => renderBlock(block, sourcesIndex + index + 1))}
        </SourceDisclosure>
      ) : null}
      {afterSourceBlocks.map((block, index) => renderBlock(block, sourcesEndIndex + index))}
    </div>
  );
}
