"""Generate student PDFs only from the public, canonical HTML chronicles.
Requires WeasyPrint 70; never reads sources/ or private teaching materials.
"""
from pathlib import Path
import re
from weasyprint import HTML, CSS
from weasyprint.urls import URLFetcher

ROOT=Path(__file__).resolve().parents[1]
local_only=URLFetcher(allowed_protocols=('file','data'), fail_on_errors=True)
PRINT=CSS(string='''
@page { size:A4; margin:15mm 17mm 16mm;
 @bottom-center {content:"MacroLab · Crónica · " counter(page) " / " counter(pages); font:9pt sans-serif;color:#526577}}
html,body{font-family:DejaVu Sans,sans-serif!important;font-size:10pt!important;line-height:1.4!important}
main{max-width:none!important;padding:0!important}main>*{max-width:100%!important}
header.masthead{padding:0 0 5mm!important}h1{font-size:21pt!important}h2{font-size:14pt!important}
.scene,.anchor,.questions,.lab,.nextstep{break-inside:auto!important}
figure,table,tr,.chain,.questions,.lab,.nextstep{break-inside:avoid!important}h2,h3{break-after:avoid!important}
p{margin:0 0 2.5mm!important}h2{margin:5mm 0 2mm!important}figure{margin:4mm 0!important;padding:2mm!important}footer{font-size:8pt!important;padding:2mm 0!important;margin:0!important}footer p{margin:0 0 1mm!important}
svg,img{max-width:100%!important}a{color:#14466b;text-decoration:none}
.topbar,.toc,.skip,.brand,.print-head{display:none!important}
''')
for number in range(3,8):
    src=ROOT/f'macro1/notas/cronica-clase{number}-chile-2026.html'
    text=re.sub(r'<link\b[^>]*>', '', src.read_text())
    target=src.with_name(f'cronica-clase{number}.pdf')
    HTML(string=text,base_url=src.as_uri(),url_fetcher=local_only).write_pdf(target,stylesheets=[PRINT])
    print(target.relative_to(ROOT))
