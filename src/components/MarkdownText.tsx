function lineToId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean);
  return parts.map((part, index) => {
    const isSourceTag = /^\[[a-z0-9.,\-\s]+\]$/i.test(part) && part.includes('-');
    return isSourceTag ? <code key={index}>{part}</code> : part;
  });
}

export function MarkdownText({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).filter(Boolean);
  return (
    <div className="markdown">
      {blocks.map((block, index) => {
        if (block.startsWith('## ')) {
          const text = block.replace(/^##\s+/, '');
          return <h2 id={lineToId(text)} key={index}>{text}</h2>;
        }
        if (block.startsWith('# ')) {
          const text = block.replace(/^#\s+/, '');
          return <h1 key={index}>{text}</h1>;
        }
        if (/^-\s+/m.test(block)) {
          const items = block.split('\n').filter((line) => line.trim().startsWith('- '));
          return (
            <ul key={index}>
              {items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item.replace(/^\s*-\s+/, ''))}</li>)}
            </ul>
          );
        }
        return <p key={index}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
