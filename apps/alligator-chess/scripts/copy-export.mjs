import { cpSync, existsSync, readFileSync, writeFileSync, readdirSync, lstatSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, relative, sep, extname } from 'node:path';

const app = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--site-root')) throw new Error('Usage: copy-export.mjs [--site-root path]');
const site = args.length ? resolve(args[1]) : resolve(app, '../..');
if (!existsSync(resolve(site, 'index.html')) || !existsSync(resolve(site, 'js/clean-url.js'))) throw new Error('Not a portfolio site root.');
const output = resolve(app, 'out');
const target = resolve(site, 'alligator-chess');
if (!existsSync(resolve(output, 'index.html'))) throw new Error('Build the app first.');
const textTypes = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.svg', '.html', '.txt', '.map']);
function hash(path) {
  const bytes = readFileSync(path);
  const content = textTypes.has(extname(path)) ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes;
  return createHash('sha256').update(content).digest('hex');
}
function listFiles(folder) {
  const files = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected link: ${path}`);
    if (entry.isDirectory()) files.push(...listFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}
function safeTarget(name) {
  const path = resolve(target, name);
  if (!path.startsWith(target + sep)) throw new Error(`Unsafe export path: ${name}`);
  let current = target;
  for (const part of relative(target, path).split(sep)) {
    current = resolve(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error(`Unexpected link: ${current}`);
  }
  return path;
}
if (existsSync(target) && lstatSync(target).isSymbolicLink()) throw new Error('Export target must not be a link.');
const files = Object.fromEntries(listFiles(output).map(path => [relative(output, path).split(sep).join('/'), hash(path)]));
const manifestPath = resolve(target, 'export-manifest.json');
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')).files : {};
// Check before overwriting: manual changes to the generated export must be reviewed.
for (const [name, expected] of Object.entries(previous)) {
  const path = safeTarget(name);
  if (existsSync(path) && hash(path) !== expected) throw new Error(`Export file was edited: ${name}`);
}
for (const name of Object.keys(files)) {
  const path = safeTarget(name);
  if (existsSync(path) && !Object.hasOwn(previous, name) && hash(path) !== files[name]) throw new Error(`Unmanaged export file: ${name}`);
}
const sourcePaths = ['src', 'public', 'scripts', 'package.json', 'package-lock.json', 'next.config.ts', 'postcss.config.mjs', 'tailwind.config.ts', 'tsconfig.json'];
const source = {};
for (const name of sourcePaths) {
  const path = resolve(app, name);
  for (const file of lstatSync(path).isDirectory() ? listFiles(path) : [path]) source[relative(app, file).split(sep).join('/')] = hash(file);
}
cpSync(output, target, { recursive: true });
for (const name of Object.keys(previous)) if (!(name in files) && existsSync(safeTarget(name))) unlinkSync(safeTarget(name));
writeFileSync(manifestPath, JSON.stringify({source, files}, null, 2) + '\n');
console.log(`Updated /alligator-chess/: ${Object.keys(files).length} files, source and export hashes recorded.`);
