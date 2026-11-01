"""Revisión estática de HTML/CSS: no ejecuta JavaScript ni utiliza navegador.
WeasyPrint compone documentos; las consultas y el audio se prueban por separado.
"""
from pathlib import Path
import re,json,logging,subprocess
import tinycss2
from weasyprint import HTML,CSS
R=Path(__file__).resolve().parents[1];Q=R/'verification';css=(R/'assets/styles.css').read_text()
logging.getLogger('weasyprint').setLevel(logging.ERROR)
def style(width):
 def flatten(nodes):
  out=[]
  for n in nodes:
   if n.type=='at-rule' and n.lower_at_keyword=='media':
    condition=tinycss2.serialize(n.prelude).strip()
    match=re.search(r'(max|min)-width:\s*(\d+)px',condition)
    if match:
     bound=int(match[2]);yes=width<=bound if match[1]=='max' else width>=bound
    else:yes='prefers-reduced-motion' in condition
    if yes:out.append(flatten(tinycss2.parse_rule_list(n.content)))
   elif n.type=='qualified-rule':out.append(tinycss2.serialize([n]))
  return '\n'.join(out)
 text=flatten(tinycss2.parse_stylesheet(css,skip_comments=True,skip_whitespace=True))
 def clamp(m):
  lo,vw,hi=map(float,m.groups());return str(max(lo,min(width*vw/100,hi)))+'px'
 text=re.sub(r'clamp\(([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)',clamp,text)
 text=re.sub(r'([\d.]+)vw',lambda m:str(float(m[1])*width/100)+'px',text)
 stagewidth=width-24 if width<=600 else width-40 if width<=850 else width-360
 return text+f'\n@page{{size:{width}px 3200px;margin:0}}body{{padding:18px {12 if width<=600 else 20}px;background:#f8f8f3}}.stage{{width:{stagewidth}px}}'
def render_slides():
 pages=[];records=[]
 for width in [1440,820,390]:
  for p in sorted((Q/'static-html').glob(f'{width}-*.html')):
   doc=HTML(filename=str(p)).render(stylesheets=[CSS(string=style(width))])
   assert len(doc.pages)==1,(p.name,len(doc.pages))
   stage=next(b for b in doc.pages[0]._page_box.descendants() if getattr(b,'element_tag',None)=='article')
   records.append(dict(file=p.name,width=width,stage_height=stage.border_height(),stage_width=stage.border_width(),page_count=1))
   assert stage.border_height()<3150,(p.name,'fuera de la página estática')
   pages.extend(doc.pages)
   print('Composición estática',p.name,round(stage.border_height()),flush=True)
 assert len(pages)==72,len(pages)
 doc.copy(pages=pages).write_pdf(Q/'revision_estatica.pdf')
 (Q/'static-render.json').write_text(json.dumps(dict(method='WeasyPrint: HTML/CSS estático sin navegador; media queries resueltas al ancho solicitado; no comprueba interacción.',records=records),ensure_ascii=False,indent=2))
 print('72 páginas estáticas compuestas para inspección.')

if __name__=='__main__':render_slides()
