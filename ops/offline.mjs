import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const source=fileURLToPath(new URL('../',import.meta.url));
export async function buildOffline(directory){
 const root=resolve(directory),files=[];
 async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.'))continue;const p=resolve(dir,e.name);if(e.isDirectory())await walk(p);else if(e.isFile()&&e.name!=='sw.js'&&!e.name.startsWith('.'))files.push(p);}}
 await walk(root);files.sort();const hash=createHash('sha256');let bytes=0;
 for(const file of files){const data=await readFile(file);hash.update(relative(root,file));hash.update(data);bytes+=data.length;}
 const id=JSON.parse(await readFile(resolve(source,'package.json'),'utf8')).name;
 const version=hash.digest('hex').slice(0,16),names=files.map(p=>relative(root,p).replaceAll('\\','/'));
 const code=`const files=${JSON.stringify(names)};const version=${JSON.stringify(version)};const prefix=${JSON.stringify('den9911:'+id+':offline:')}+encodeURIComponent(new URL(self.registration.scope).pathname)+':';const cacheName=prefix+version;
const urls=files.map(p=>new URL(p,self.registration.scope).href);const known=new Set(urls);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(cacheName);try{await cache.addAll(urls);}catch(error){await caches.delete(cacheName);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(prefix)&&name!==cacheName)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const key=new URL(event.request.url);if(key.origin!==self.location.origin)return;key.search='';key.hash='';if(key.pathname.endsWith('/'))key.pathname+='index.html';if(!known.has(key.href))return;event.respondWith((async()=>{const cache=await caches.open(cacheName);return await cache.match(key.href)||fetch(event.request);})());});
`;
 await writeFile(resolve(root,'sw.js'),code);console.log(JSON.stringify({offlineProject:id,files:files.length,bytes,version}));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildOffline(process.argv[2]??resolve(source,'public'));
