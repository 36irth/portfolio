import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const srcDir = join(root, 'src');
const publicPortfolioDir = join(root, 'public', 'assets', 'portfolio');
const distDir = join(root, 'dist');
const distAssetsDir = join(distDir, 'assets');
const distPortfolioDir = join(distAssetsDir, 'portfolio');

const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css']);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);
const errors = [];

const walk = (dir) => {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(path));
    } else {
      files.push(path);
    }
  }
  return files;
};

const referencedPortfolioAssets = new Set();
for (const file of walk(srcDir)) {
  const extension = file.slice(file.lastIndexOf('.'));
  if (!sourceExtensions.has(extension)) continue;

  const contents = readFileSync(file, 'utf8');
  const patterns = [
    /\basset\(['"]([^'"]+)['"]\)/g,
    /\bportfolioAsset\(['"]([^'"]+)['"]\)/g,
    /assets\/portfolio\/([^'")\s`]+?\.(?:png|jpe?g|webp|gif|svg))/g,
  ];

  for (const pattern of patterns) {
    for (const match of contents.matchAll(pattern)) {
      referencedPortfolioAssets.add(match[1]);
    }
  }
}

for (const assetName of referencedPortfolioAssets) {
  if (!imageExtensions.has(assetName.slice(assetName.lastIndexOf('.')).toLowerCase())) continue;
  const publicPath = join(publicPortfolioDir, assetName);
  const distPath = join(distPortfolioDir, assetName);
  if (!existsSync(publicPath)) {
    errors.push(`Missing public asset: ${publicPath}`);
  }
  if (!existsSync(distPath)) {
    errors.push(`Missing built asset: ${distPath}`);
  }
}

if (existsSync(distAssetsDir)) {
  for (const file of walk(distAssetsDir)) {
    const extension = file.slice(file.lastIndexOf('.'));
    if (!new Set(['.js', '.css']).has(extension)) continue;

    const contents = readFileSync(file, 'utf8');
    if (contents.includes('"/assets/portfolio/') || contents.includes("'/assets/portfolio/")) {
      errors.push(`Absolute portfolio image path found in built asset: ${file}`);
    }
  }
}

const indexHtml = join(distDir, 'index.html');
if (existsSync(indexHtml)) {
  const html = readFileSync(indexHtml, 'utf8');
  if (html.includes('src="/assets/') || html.includes('href="/assets/')) {
    errors.push('Absolute dist asset path found in dist/index.html');
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Verified ${referencedPortfolioAssets.size} portfolio asset references.`);
