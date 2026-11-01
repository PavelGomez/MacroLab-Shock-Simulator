"""Narración propia, local, una sola voz; tiempos medidos en las muestras producidas.
Ejecutar con el entorno tts-env documentado en README. No requiere red.
"""
from pathlib import Path
import os,json,hashlib,subprocess,time,unicodedata
os.environ.update(ORT_LOG_SEVERITY_LEVEL='3',HF_HUB_DISABLE_TELEMETRY='1',HF_HUB_OFFLINE='1')
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1]
MODELS=Path(os.environ.get('MF_MODELS','/Users/pgomez/Documents/Codex/2026-10-17/referenced-chatgpt-conversation-this-is-an/work/models'))
FFMPEG='/opt/homebrew/bin/ffmpeg'; FFPROBE='/opt/homebrew/bin/ffprobe'; SR=24000
D=json.loads((ROOT/'production/storyboard.json').read_text())
CACHE=Path(os.environ.get('MF_AUDIO_CACHE',str(ROOT/'production/audio-cache'))); CACHE.mkdir(parents=True,exist_ok=True)
ort.disable_telemetry_events()
opt=ort.SessionOptions();opt.intra_op_num_threads=4;opt.inter_op_num_threads=1;opt.log_severity_level=3
session=ort.InferenceSession(str(MODELS/'kokoro-v1.0.onnx'),sess_options=opt,providers=['CPUExecutionProvider'])
k=Kokoro.from_session(session,str(MODELS/'voices-v1.0.bin'))
assert 'em_alex' in k.get_voices()
config={**D['voice'],'sample_rate':SR,'sentence_pause':.25,'clause_pause':.10,'paragraph_gap':.55,'version':'mf-paragraph-v1'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def synth(text):
 text=unicodedata.normalize('NFC',text)
 key=hashlib.sha256(json.dumps([text,config],ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:24]
 p=CACHE/(key+'.wav')
 if not p.exists():
  raw=CACHE/(key+'-raw.wav')
  x,sr=k.create(text,voice='em_alex',speed=.90,lang='es',sentence_pause=.25,clause_pause=.10)
  assert sr==SR and len(x)>SR*.3 and np.isfinite(x).all()
  sf.write(raw,x,SR,subtype='FLOAT')
  subprocess.run([FFMPEG,'-v','error','-y','-i',str(raw),'-af','atempo=1.04','-c:a','pcm_f32le',str(p)],check=True)
 x,sr=sf.read(p,dtype='float32');assert sr==SR
 active=np.flatnonzero(np.abs(x)>.006)
 assert len(active)>0
 x=x[max(0,active[0]-2400):min(len(x),active[-1]+2400)]
 fade=min(120,len(x)//2);x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
 return x
def oral_title(t):
 for a,b in [('IS–LM','i ese ele eme'),('IS','i ese'),('LM','ele eme'),('BP','be pe'),('E = CLP/USD','e, pesos chilenos por dólar'),('M/P','dinero real'),('E','e'),('G','ge')]:t=t.replace(a,b)
 return t
manifest=[];started=time.time()
for ch in D['chapters']:
 parts=[];pos=0
 def add(x):
  global pos
  parts.append(x);pos+=len(x)/SR
 def silence(t):add(np.zeros(round(t*SR),np.float32))
 arr=[s for s in D['slides'] if s['chapter']==ch['index']]
 for j,s in enumerate(arr):
  s['start']=pos;s['events']=[]
  def speech(text,kind='speech',block=-1):
   st=pos;x=synth(text);add(x)
   s['events'].append(dict(start=st,end=pos,kind=kind,text=text,block=block))
   silence(.55)
  speech(('Capítulo '+str(ch['index']+1)+'. ' if j==0 else '')+oral_title(s['title']),'heading')
  for n,b in enumerate(s['blocks']):
   if b['kind']=='speech':speech(b['text'],block=n)
   else:
    st=pos;silence(b['seconds']);s['events'].append(dict(start=st,end=pos,kind='study',text=b['text'],block=n))
  silence(.7);s['end']=pos
  s['revealTime']=next((e['start'] for e in s['events'] if e['block']==s['revealAfter']),None) if s['revealAfter'] is not None else None
  for step in s.get('steps',[]):
   event=next(e for e in s['events'] if e['kind']=='speech' and e['block']==step['block'])
   step.update(start=event['start'],end=event['end'])
  print(f"Diapositiva {s['id']:02}: {s['end']-s['start']:.1f} s",flush=True)
 silence(.7)
 wav=CACHE/f"capitulo-{ch['index']+1:02}.wav";sf.write(wav,np.concatenate(parts),SR,subtype='FLOAT')
 target=ROOT/'assets/audio'/f"capitulo-{ch['index']+1:02}.mp3"
 subprocess.run([FFMPEG,'-v','error','-y','-i',str(wav),'-af','loudnorm=I=-18:TP=-1.7:LRA=9','-ar',str(SR),'-ac','1','-c:a','libmp3lame','-b:a','96k',str(target)],check=True)
 probe=json.loads(subprocess.check_output([FFPROBE,'-v','error','-show_entries','format=duration','-of','json',str(target)]))
 ch.update(audio='assets/audio/'+target.name,duration=float(probe['format']['duration']),pcmDuration=pos)
 arr[-1]['end']=ch['duration']
 manifest.append(dict(chapter=ch['index'],duration=ch['duration'],sha256=sha(target),bytes=target.stat().st_size))
 (ROOT/'production/timeline.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
 print(f"CAPÍTULO {ch['index']+1} COMPLETO: {ch['duration']:.1f} s",flush=True)
D['duration']=sum(c['duration'] for c in D['chapters'])
(ROOT/'production/timeline.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
(ROOT/'assets/lesson.js').write_text('window.Lesson = '+json.dumps(D,ensure_ascii=False)+';\n')
(ROOT/'verification/audio-manifest.json').write_text(json.dumps(dict(config=config,model_sha256=sha(MODELS/'kokoro-v1.0.onnx'),voices_sha256=sha(MODELS/'voices-v1.0.bin'),chapters=manifest,total_seconds=D['duration'],production_seconds=time.time()-started),ensure_ascii=False,indent=2))
print('NARRACIÓN COMPLETA',D['duration'],'segundos',flush=True)
