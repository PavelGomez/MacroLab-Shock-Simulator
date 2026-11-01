#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),file=path.join(root,'macro1/index.html');
const block='<!-- CLASE8:BEGIN -->\n'+['mf-model.js','clase8.js'].map(f=>`<script id="${f.replace('.js','')}-embedded">\n${fs.readFileSync(path.join(root,'macro1',f),'utf8')}\n</script>`).join('\n')+'\n<!-- CLASE8:END -->';
const html=fs.readFileSync(file,'utf8'),re=/<!-- CLASE8:BEGIN -->[\s\S]*?<!-- CLASE8:END -->/;
if(!re.test(html))throw Error('Falta el punto de integración de Clase 8');
const updated=html.replace(re,block);
if(process.argv.includes('--check')){if(html!==updated){console.error('Clase 8 embebida fuera de fecha');process.exit(1)}console.log('Clase 8 embebida al día');}else{fs.writeFileSync(file,updated);console.log('Clase 8 embebida actualizada');}
