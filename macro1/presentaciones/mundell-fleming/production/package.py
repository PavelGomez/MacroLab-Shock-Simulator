"""Audita referencias locales y crea el paquete completo sin modelos ni cachés."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,hashlib,zipfile
R=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self):super().__init__();self.refs=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('src','href') and v:self.refs.append((tag,k,v))
checked=[]
for p in [R/'index.html',*(R/'docs').glob('*.html')]:
 h=Links();h.feed(p.read_text())
 for tag,attr,url in h.refs:
  u=urlsplit(url)
  if u.scheme or not u.path:continue
  target=(p.parent/unquote(u.path)).resolve();assert target.is_file(),(p,url)
  checked.append(dict(from_file=str(p.relative_to(R)),target=str(target.relative_to(R))))
for s in json.loads((R/'production/timeline.json').read_text())['chapters']:
 assert (R/s['audio']).is_file()
exclude_dirs={'audio-cache','audio-qa','static-html','static-png','__pycache__'}
files=[p for p in R.rglob('*') if p.is_file() and not any(x in exclude_dirs for x in p.relative_to(R).parts) and p.suffix not in ('.zip','.log','.pdf','.pyc') and p.name not in ('SHA256_ARCHIVOS.txt','SHA256_PAQUETE.txt','package-checks.json')]
hashes=[]
for p in sorted(files):hashes.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(R)))
(R/'SHA256_ARCHIVOS.txt').write_text('\n'.join(hashes)+'\n')
archive=R/'COMPARTIR_Mundell_Fleming_Macro1.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in [*files,R/'SHA256_ARCHIVOS.txt']:z.write(p,'PRESENTACION_MUNDELL_FLEMING/'+str(p.relative_to(R)))
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 names=z.namelist();assert 'PRESENTACION_MUNDELL_FLEMING/index.html' in names
 assert len([n for n in names if n.endswith('.mp3')])==7
 for line in hashes:
  digest,name=line.split('  ',1);assert hashlib.sha256(z.read('PRESENTACION_MUNDELL_FLEMING/'+name)).hexdigest()==digest
digest=hashlib.sha256(archive.read_bytes()).hexdigest()
(R/'SHA256_PAQUETE.txt').write_text(digest+'  '+archive.name+'\n')
report=dict(status='PASS',local_references_checked=len(checked),files=len(files)+1,mp3=7,bytes=archive.stat().st_size,archive_sha256=digest,links=checked,limits='Auditoría de referencias y ZIP, no prueba de navegador.')
(R/'verification/package-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='links'},ensure_ascii=False,indent=2))
