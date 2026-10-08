/* Idempotent resource actions derived from PDF links on the canonical public pages. */
const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'macro1/notas');
const map={};
for(let n=3;n<=7;n++){
 const p=path.join(dir,`cronica-clase${n}-chile-2026.html`);let s=fs.readFileSync(p,'utf8');
 if(!s.includes(`href="cronica-clase${n}.pdf"`))s=s.replace(/(<nav class="topbar"[^>]*>)/,`$1<a class="dl" href="cronica-clase${n}.pdf" download>Descargar PDF</a>`);
 fs.writeFileSync(p,s);
}
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.html')&&f!=='index.html')){
 const d=new JSDOM(fs.readFileSync(path.join(dir,f),'utf8')).window.document;
 const a=d.querySelector('a[download][href$=".pdf"]');if(a)map[f]=a.getAttribute('href');
}
const index=path.join(dir,'index.html');let html=fs.readFileSync(index,'utf8');
html=html.replace(/ <span class="resource-actions">[\s\S]*?<\/span>/g,'');
html=html.replace(/<a href="([^"]+)"([^>]*)>([^<]*(?:<[^a][^>]*>[^<]*)*)<\/a>/g,(all,href,attrs,text)=>{
 if(attrs.includes('download')||text.includes('Descargar PDF')||text.includes('Leer en línea')||text.includes('Abrir PDF'))return all;
 if(map[href])return `${all} <span class="resource-actions">· <a href="${href}">Leer en línea</a> · <a href="${map[href]}" download>Descargar PDF</a></span>`;
 if(href.endsWith('.pdf'))return `${all} <span class="resource-actions">· <a href="${href}" download>Descargar PDF</a></span>`;
 return all;
});
fs.writeFileSync(index,html);
const app=path.join(root,'macro1/index.html');let s=fs.readFileSync(app,'utf8');
const declaration='const PUBLIC_NOTE_PDFS='+JSON.stringify(map,null,2)+';\n';
if(!s.includes('const PUBLIC_NOTE_PDFS='))s=s.replace('function renderClassSource(source){',declaration+'function renderClassSource(source){');
else s=s.replace(/const PUBLIC_NOTE_PDFS=[\s\S]*?;\nfunction renderClassSource/,declaration+'function renderClassSource');
s=s.replace('return `<li><a href="${escapeText(url)}"${target}>${label}${newTabHint}</a>${location}</li>`;',
`const pdf=item.href.endsWith(".pdf")?url:PUBLIC_NOTE_PDFS[item.href]?NOTES_BASE+PUBLIC_NOTE_PDFS[item.href]:null;
  const actions=pdf?\` <span class="resource-actions">· <a href="\${escapeText(url)}"\${target}>\${item.href.endsWith(".pdf")?"Abrir PDF":"Leer en línea"}\${newTabHint}</a> · <a href="\${escapeText(pdf)}" download aria-label="Descargar PDF: \${label}">Descargar PDF</a></span>\`:"";
  return \`<li><a href="\${escapeText(url)}"\${target}>\${label}\${newTabHint}</a>\${location}\${actions}</li>\`;`);
fs.writeFileSync(app,s);
fs.writeFileSync(path.join(root,'docs/auditoria-enlaces-2026-10-08/pdf-map.json'),JSON.stringify(map,null,2));
console.log(map);
