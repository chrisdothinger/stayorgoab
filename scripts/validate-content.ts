import { loadRepositoryContent } from '../src/lib/content';
import { validateContentModel } from '../src/lib/validation';

const result = validateContentModel(loadRepositoryContent());
if (!result.ok) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}
console.log('Content model validated.');
