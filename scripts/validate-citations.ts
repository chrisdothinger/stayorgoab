import { loadRepositoryContent } from '../src/lib/content';
import { validateContentModel } from '../src/lib/validation';

const result = validateContentModel(loadRepositoryContent());
const citationErrors = result.errors.filter((error) => error.includes('source') || error.includes('claim') || error.includes('Claim'));

if (citationErrors.length) {
  console.error(citationErrors.join('\n'));
  process.exit(1);
}
console.log('Citations validated.');
