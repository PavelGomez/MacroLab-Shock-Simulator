from pathlib import Path
import json
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parents[1]/'verification';meta=json.loads((R/'static-render.json').read_text())['records']
for n,m in enumerate(meta,1):
 p=R/'static-png'/f'pagina-{n:02}.png';im=Image.open(p).convert('RGB')
 im=im.crop((0,0,min(im.width,int(m['stage_width']+40)),min(im.height,int(m['stage_height']+40))))
 im.save(R/'static-png'/m['file'].replace('.html','.png'))
for width in [1440,820,390]:
 subset=[m for m in meta if m['width']==width];tw=300;th=420;sheet=Image.new('RGB',(4*tw,6*th),'#dfe6e5');draw=ImageDraw.Draw(sheet)
 for k,m in enumerate(subset):
  im=Image.open(R/'static-png'/m['file'].replace('.html','.png'));im.thumbnail((tw-14,th-36));x=(k%4)*tw+7;y=(k//4)*th+26
  sheet.paste(im,(x+(tw-14-im.width)//2,y));draw.text((x,y-21),f'{width} px · Diapositiva {k+1}',fill='#193b4b')
 sheet.save(R/f'contacto-{width}.png')
print('Tres hojas de contacto de la composición final.')
