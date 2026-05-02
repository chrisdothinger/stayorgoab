function lineToId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
