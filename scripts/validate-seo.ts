import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'out');
const requiredKeywords = ['Alberta referendum', 'Alberta independence', 'Alberta separation'];
const requiredFiles = ['index.html', 'questions/index.html', 'sources/index.html', 'sitemap.xml', 'robots.txt'];
const representativePages = [
  'index.html',
  'questions/index.html',
  'questions/legal-process/index.html',
  'questions/referendum-mechanics/index.html',
  'questions/legal-process/pro/index.html',
  'questions/legal-process/anti/index.html'
];

const errors: string[] = [];

function read(relativePath: string) {
  const filePath = path.join(OUT_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing ${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

for (const file of requiredFiles) read(file);

for (const file of representativePages) {
  const html = read(file);
  if (!html) continue;
  if (!/<title>.+StayOrGoAB/.test(html)) errors.push(`${file} missing StayOrGoAB title`);
  if (!/<meta name="description" content="[^"]{80,}"/.test(html)) errors.push(`${file} missing substantial meta description`);
  if (!/<link rel="canonical" href="https:\/\/stayorgoab\.ca\//.test(html)) errors.push(`${file} missing stayorgoab.ca canonical`);
  if (!/<meta property="og:title"/.test(html)) errors.push(`${file} missing Open Graph title`);
  if (!/<meta name="twitter:card"/.test(html)) errors.push(`${file} missing Twitter card metadata`);
  for (const keyword of requiredKeywords) {
    if (!html.includes(keyword)) errors.push(`${file} missing keyword phrase: ${keyword}`);
  }
}

const sitemap = read('sitemap.xml');
if (sitemap) {
  for (const url of [
    'https://stayorgoab.ca/',
    'https://stayorgoab.ca/questions/',
    'https://stayorgoab.ca/questions/legal-process/',
    'https://stayorgoab.ca/questions/referendum-mechanics/',
    'https://stayorgoab.ca/questions/legal-process/pro/',
    'https://stayorgoab.ca/questions/legal-process/anti/',
    'https://stayorgoab.ca/sources/'
  ]) {
    if (!sitemap.includes(url)) errors.push(`sitemap missing ${url}`);
  }
  if (sitemap.includes('/questions/legal-process/neutral/')) {
    errors.push('sitemap should not include merged neutral compatibility routes');
  }
}

const robots = read('robots.txt');
if (robots) {
  if (!robots.includes('Sitemap: https://stayorgoab.ca/sitemap.xml')) errors.push('robots.txt missing sitemap URL');
  if (!robots.includes('Disallow: /questions/*/neutral/')) errors.push('robots.txt missing neutral compatibility disallow');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`SEO launch files validated (${representativePages.length} representative pages).`);
