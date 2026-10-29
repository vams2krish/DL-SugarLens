import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

test('hosted navigation uses network and offline fallback removes redirect/encoding metadata',async()=>{
 const handlers={};let offline=false,matched=false;
 const cached=new Response('<html>offline shell</html>',{headers:{'content-type':'text/html','content-encoding':'gzip','content-length':'999'}});
 Object.defineProperty(cached,'redirected',{value:true});
 const scope={self:{registration:{scope:'https://example.com/'},location:{origin:'https://example.com'},addEventListener:(name,fn)=>{handlers[name]=fn}},caches:{open:async()=>({match:async(request,options)=>{assert.equal(options.ignoreVary,true);matched=true;return cached;}})},fetch:async()=>{if(offline)throw Error('Offline');return new Response('online shell');},Response,Headers,URL};
 vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),scope);
 const request={method:'GET',url:'https://example.com/',mode:'navigate'};
 let result;handlers.fetch({request,respondWith:value=>{result=value}});assert.equal(await(await result).text(),'online shell');assert.equal(matched,false);
 offline=true;handlers.fetch({request,respondWith:value=>{result=value}});const response=await result;
 assert.equal(await response.text(),'<html>offline shell</html>');assert.equal(response.redirected,false);assert.equal(response.headers.get('content-encoding'),null);assert.equal(response.headers.get('content-length'),null);assert.equal(response.headers.get('content-type'),'text/html');
});
