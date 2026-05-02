import fs from 'node:fs';
import path from 'node:path';
import { loadRepositoryContent } from '../src/lib/content';
import { buildSearchIndex } from '../src/lib/search';

const outputPath = path.join(process.cwd(), 'public', 'search-index.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(buildSearchIndex(loadRepositoryContent()), null, 2) + '\n');
console.log(`Generated ${outputPath}`);
