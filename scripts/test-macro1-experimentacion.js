#!/usr/bin/env node
"use strict";
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const tests=fs.readdirSync(path.join(root,'macro1')).filter(f=>/^test_.*\.js$/.test(f)).sort().map(f=>'macro1/'+f).concat(['test_pautas_biblioteca.js','scripts/check-manifest.js']);
const results=tests.map(file=>{
  const r=spawnSync(process.execPath,[file],{cwd:root,encoding:'utf8'}),output=(r.stdout||'')+(r.stderr||'');
  console.log(`${r.status===0?'OK':'FALLA'} · ${file}`);if(r.status!==0)console.log(output);
  const count=output.match(/(?:Aserciones:|Comprobaciones:)\s*(\d+)|(?:—\s*|^)(\d+)\s*(?:aserciones|navigation assertions|comprobaciones)/m);
  return {file,exitCode:r.status,assertions:count?Number(count[1]||count[2]):(output.match(/(\d+) comprobaciones OK/)?.[1]?Number(output.match(/(\d+) comprobaciones OK/)[1]):null),output:output.trim()};
});
const failed=results.filter(r=>r.exitCode!==0),report={date:new Date().toISOString(),node:process.version,totalSuites:results.length,failed:failed.length,assertions:results.reduce((s,r)=>s+(r.assertions||0),0),results};
if(process.argv.includes('--report')){
  const target=process.argv[process.argv.indexOf('--report')+1];if(!target)throw new Error('Indica la ruta del reporte después de --report');fs.writeFileSync(path.resolve(root,target),JSON.stringify(report,null,2)+'\n');
}
console.log(`${results.length} suites · ${failed.length} fallos · ${report.assertions} comprobaciones contadas`);process.exitCode=failed.length?1:0;
