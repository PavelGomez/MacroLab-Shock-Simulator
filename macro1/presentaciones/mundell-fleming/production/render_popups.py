"""Composición estática de las consultas; no ejecuta navegador ni audio."""
from pathlib import Path
import json
from weasyprint import HTML, CSS
from render_static import style

R = Path(__file__).resolve().parents[1] / 'verification'
pages, records = [], []
for width in (1440, 390):
    for p in sorted((R / 'static-html').glob(f'intercepts-{width}-*.html')):
        extra = f'dialog{{display:block;position:static;margin:0;width:{min(1100,width-24)}px;max-height:none}}'
        doc = HTML(filename=str(p)).render(stylesheets=[CSS(string=style(width)+extra)])
        assert len(doc.pages) == 1, p.name
        box = next(b for b in doc.pages[0]._page_box.descendants() if getattr(b, 'element_tag', None) == 'dialog')
        records.append(dict(file=p.name, width=width, height=box.border_height()))
        pages.extend(doc.pages)
assert len(pages) == 14, len(pages)
doc.copy(pages=pages).write_pdf(R / 'interceptos_opcionales.pdf')
(R / 'intercepts-render.json').write_text(json.dumps(dict(method='WeasyPrint, consultas estáticas sin navegador; desplazamiento comprobado solo por estructura CSS.', records=records), ensure_ascii=False, indent=2))
print('14 consultas estáticas compuestas; escala completa legible, desplazable en móvil.')
