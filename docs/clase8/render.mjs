import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const req=createRequire(path.join(process.env.RUNTIME_NODE_MODULES,'package.json')),{chromium}=req('playwright');
const root=path.resolve(import.meta.dirname,'../..'),out=process.env.QA_OUTPUT||'/private/tmp/clase8-qa';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'||route.request().url().startsWith('file:')?route.continue():route.abort());
const docs=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'documentos.json'),'utf8'));
for(const d of docs){await page.goto('http://127.0.0.1:8768/'+d.file,{waitUntil:'networkidle'});if(d.source==='pauta'){await page.locator('#pauta-attempt').fill('Mi intento: bajo flotación LM y BP fijan Y e i; debo calcular E y comprobar XN en la IS.');await page.locator('#pauta-commit').click();await page.locator('#attempt-gate').evaluate(el=>el.remove());}
await page.pdf({path:path.join(root,d.pdf),format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font:9px Arial;color:#556676;width:100%;padding:0 55px;display:flex;justify-content:space-between"><span>MacroLab · Clase 8 · Profesor Pável Gómez · 2026</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',preferCSSPageSize:true});
await page.screenshot({path:path.join(out,d.source+'-desktop.png'),fullPage:true});console.log('PDF y web',d.source);}
await page.goto('http://127.0.0.1:8768/macro1/index.html?clase=8#route',{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,'ruta-desktop.png'),fullPage:true});
await page.goto('http://127.0.0.1:8768/macro1/mundell-fleming.html?shock=fiscal',{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,'lab-desktop.png'),fullPage:true});
await page.setViewportSize({width:390,height:844});
for(const [name,file]of[['ruta','macro1/index.html?clase=8#route'],['lab','macro1/mundell-fleming.html?shock=money'],...docs.map(d=>[d.source,d.file])]){await page.goto('http://127.0.0.1:8768/'+file,{waitUntil:'networkidle'});await page.screenshot({path:path.join(out,name+'-mobile.png'),fullPage:true});const wide=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(wide)throw Error('Desborde móvil '+name);}
await browser.close();console.log('Render completo:',out);
