import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=(await walk('dist')).filter(file=>!file.endsWith('sw.js')&&!file.includes(`${path.sep}.openai${path.sep}`));
const hash=createHash('sha256');for(const file of files)hash.update(await fs.readFile(file));
const source=await fs.readFile('public/sw.js','utf8');
await fs.writeFile('dist/sw.js',source.replace('__CACHE__',`sugarlens-${hash.digest('hex').slice(0,12)}`).replace('/*__PRECACHE__*/[]',JSON.stringify(files.map(f=>'./'+path.relative('dist',f).split(path.sep).join('/')))));
console.log(`Service worker prepared with ${files.length} local resources.`);
