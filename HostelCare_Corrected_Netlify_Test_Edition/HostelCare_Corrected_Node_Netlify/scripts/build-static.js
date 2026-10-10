import {mkdir,cp,writeFile} from 'node:fs/promises';
await mkdir('dist/static',{recursive:true});
await cp('public','dist/static',{recursive:true});
await writeFile('dist/index.html','<!doctype html><title>HostelCare</title><meta http-equiv="refresh" content="0; url=/login">');
console.log('Built public static assets');
