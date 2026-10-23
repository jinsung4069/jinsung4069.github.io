// Rebuild the committed, static runtime assets. No compiler runs in the browser.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import forms from '@tailwindcss/forms';
import containers from '@tailwindcss/container-queries';
import * as solid from '@fortawesome/free-solid-svg-icons';
import * as brands from '@fortawesome/free-brands-svg-icons';
const require=createRequire(import.meta.url);
await fs.mkdir('assets/site',{recursive:true});
const manifest=JSON.parse(await fs.readFile('apps/site-build.json','utf8'));
for(const [name,file] of Object.entries(manifest)){
 const config=require(`../apps/${name}-tailwind.cjs`);
 config.content=[file,`apps/${name}/**/*.jsx`];
 if(name.startsWith('ai_'))config.plugins=[forms,containers];
 const result=await postcss([tailwind(config)]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;',{from:undefined});
 const css=await import('esbuild').then(m=>m.transform(result.css,{loader:'css',minify:true}));
 await fs.writeFile(`assets/site/${name}.css`,css.code);
}
for(const name of ['microrobot','stackburger'])await build({entryPoints:[`apps/${name}/main.jsx`],outfile:`assets/site/${name}.js`,bundle:true,minify:true,legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'},target:['es2020']});
// npm's WASM file has an executable bit on Unix. Publish ordinary static files
// without inheriting platform-specific source permissions.
for(const file of ['sql-wasm.js','sql-wasm.wasm'])await fs.writeFile(`assets/site/${file}`,await fs.readFile(`node_modules/sql.js/dist/${file}`));
// Scan source only. Retain aliases (for example fa-times) used by existing controls.
async function sources(dir){const out=[];for(const f of await fs.readdir(dir,{withFileTypes:true})){if(['.git','node_modules','alligator-chess'].includes(f.name)||/^(tmp|temp|scratch)-/.test(f.name))continue;const p=path.join(dir,f.name);if(f.isDirectory())out.push(...await sources(p));else if(/\.(html|js|jsx)$/.test(f.name)&&!p.startsWith('assets'))out.push(await fs.readFile(p,'utf8'));}return out;}
const names=new Set((await sources('.')).join('\n').match(/(?<=\bfa-)[a-z0-9-]+/g));
const definitions=new Map();for(const v of [...Object.values(solid),...Object.values(brands)])if(v?.icon){definitions.set(v.iconName,v);for(const alias of v.icon[2])if(typeof alias==='string')definitions.set(alias,v);}
let css='/* Font Awesome 6.5.1 icons, CC BY 4.0. Selected SVGs, no font download. */\n.fas,.fab,.fa-solid,.fa-brands{display:inline-block;width:1.25em;height:1em;line-height:1;vertical-align:-.125em;font-style:normal}.fas::before,.fab::before,.fa-solid::before,.fa-brands::before{content:"";display:block;width:100%;height:100%;background:currentColor;mask:var(--site-icon) center/contain no-repeat;-webkit-mask:var(--site-icon) center/contain no-repeat}\n';
for(const name of [...names].sort()){const d=definitions.get(name);if(!d)continue;const [w,h,,,data]=d.icon;const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${[].concat(data).map(s=>`<path d="${s}"/>`).join('')}</svg>`;css+=`.fa-${name}{--site-icon:url("data:image/svg+xml,${encodeURIComponent(svg)}")}\n`;}
await fs.writeFile('assets/site/icons.css',css);
let licenses='# Third party runtime licenses\n\n';
for(const pkg of ['react','react-dom','sql.js','tailwindcss','@tailwindcss/forms','@tailwindcss/container-queries','@fortawesome/free-solid-svg-icons','@fortawesome/free-brands-svg-icons']){
 const dir=`node_modules/${pkg}`;const files=await fs.readdir(dir);const file=files.find(f=>/^license(?:\.txt|\.md)?$/i.test(f));if(file)licenses+=`## ${pkg}\n\n${await fs.readFile(`${dir}/${file}`,'utf8')}\n\n`;
}
await fs.writeFile('assets/site/LICENSES.md',licenses.trimEnd()+'\n');
console.log('Built',Object.keys(manifest).length,'stylesheets, two production games, SQLite and selected icons.');
