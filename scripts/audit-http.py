"""Read-only GET/content audit. Network failures are not labelled broken links."""
import json, pathlib, urllib.request, urllib.error, concurrent.futures, hashlib, re, subprocess
from urllib.parse import urldefrag, urljoin
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/auditoria-enlaces-2026-10-08'
BASE='https://pavelgomez.github.io/MacroLab-Shock-Simulator/'
data=json.loads((OUT/'inventory-raw.json').read_text())
urls={urldefrag(r['final'])[0] for r in data['rows'] if r['final'].startswith('http')}
urls.update(urljoin(BASE,p) for p in data['pages'])
# Include sources embedded in JS registries, JSON data and HTML script literals.
refs=[]
for p in ROOT.rglob('*'):
 if any(x in p.parts for x in ['.git','node_modules','docs','sources']) or p.suffix not in ['.html','.js','.json']:continue
 if p.name.startswith(('test_','DIA_','REGIME_TEMPLATE')) or p.parent.name=='scripts':continue
 s=p.read_text(errors='replace')
 for m in re.finditer(r'''["'](https?://[^\s"'<>`]+)["']''',s):
  u=m.group(1).replace('&amp;','&')
  if any(x in u for x in ['schema.org','fonts.googleapis','fonts.gstatic','cdn.jsdelivr','www.w3.org','localhost']):continue
  refs.append({'page':str(p.relative_to(ROOT)),'line':s[:m.start()].count('\n')+1,'url':u})
  urls.add(urldefrag(u)[0])
(OUT/'references-source.json').write_text(json.dumps(refs,ensure_ascii=False,indent=2))
cache=OUT/'http.json'
old=json.loads(cache.read_text()) if cache.exists() else []
done={r['url']:r for r in old if r.get('status')==200}
def check(u):
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 MacroLab-link-audit'}),timeout=22) as r:
   b=r.read();typ=r.headers.get('Content-Type','');s=b.decode('utf8',errors='replace')
   title=re.search(r'<title[^>]*>(.*?)</title>',s,re.S|re.I)
   x={'url':u,'final':r.url,'status':r.status,'type':typ,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'title':re.sub(r'\s+',' ',title.group(1)).strip() if title else '', 'pdf':b.startswith(b'%PDF')}
   if u.startswith(BASE):
    rel=u[len(BASE):].split('?')[0];f=ROOT/(rel+'index.html' if rel.endswith('/') or not rel else rel)
    if f.exists() and f.is_file():x['identical_local']=b==f.read_bytes()
   return x
 except Exception as e:return {'url':u,'status':getattr(e,'code',None),'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 for r in pool.map(check,sorted(urls-done.keys())):
  done[r['url']]=r
  cache.write_text(json.dumps(list(done.values()),ensure_ascii=False,indent=2))
print(json.dumps({'unique_http':len(done),'ok':sum(r.get('status')==200 for r in done.values()),'unverified':[r for r in done.values() if r.get('status')!=200]},ensure_ascii=False,indent=2))
