"""Decodificación, silencios y reconocimiento local de pasajes con fórmulas y cifras."""
from pathlib import Path
import os,json,subprocess,re,time,unicodedata
import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
R=Path(__file__).resolve().parents[1];D=json.loads((R/'production/timeline.json').read_text());Q=R/'verification';cache=Path(os.environ.get('MF_AUDIO_QA_CACHE',str(R/'production/audio-qa')));cache.mkdir(parents=True,exist_ok=True)
ffmpeg='/opt/homebrew/bin/ffmpeg'; records=[]
for ch in D['chapters']:
 target=R/ch['audio'];wav=cache/f'capitulo-{ch["index"]+1}.wav'
 subprocess.run([ffmpeg,'-v','error','-y','-i',str(target),str(wav)],check=True)
 x,sr=sf.read(wav,dtype='float32');assert sr==24000 and np.isfinite(x).all()
 assert abs(len(x)/sr-ch['pcmDuration'])<.1
 pauses=[]
 for s in D['slides']:
  if s['chapter']!=ch['index']:continue
  for e in s['events']:
   assert 0<=e['start']<=e['end']<=ch['duration']+.001
   if e['kind']=='study':
    a=x[int((e['start']+.2)*sr):int((e['end']-.2)*sr)];rms=float(np.sqrt(np.mean(a*a)));assert rms<.0001
    pauses.append(dict(slide=s['id'],start=e['start'],end=e['end'],rms=rms))
 records.append(dict(chapter=ch['index']+1,decoded_seconds=len(x)/sr,peak=float(np.max(np.abs(x))),study_pauses=pauses))
 print('Decodificado capítulo',ch['index']+1,flush=True)
model=WhisperModel('/Users/pgomez/Documents/Codex/2026-10-17/referenced-chatgpt-conversation-this-is-an/work/models/whisper-base',device='cpu',compute_type='int8',cpu_threads=4,num_workers=1,local_files_only=True)
samples=[]
for slide,block in [(3,1),(6,2),(10,0),(11,1),(17,2),(18,2),(20,3),(24,0)]:
 s=D['slides'][slide-1];e=next(e for e in s['events'] if e['block']==block);ch=D['chapters'][s['chapter']]
 sample=cache/f'pasaje-{slide:02}.wav'
 subprocess.run([ffmpeg,'-v','error','-y','-ss',str(e['start']),'-i',str(R/ch['audio']),'-t',str(e['end']-e['start']),'-ar','16000',str(sample)],check=True)
 # Pasar muestras evita una incompatibilidad entre faster-whisper y PyAV en este entorno.
 waveform,sr=sf.read(sample,dtype='float32');assert sr==16000
 segments,info=model.transcribe(waveform,language='es',beam_size=5,condition_on_previous_text=False,vad_filter=False)
 text=' '.join(x.text.strip() for x in segments)
 samples.append(dict(slide=slide,chapter=s['chapter']+1,start=e['start'],end=e['end'],expected=e['text'],recognized=text,language=info.language))
 print('PASAJE',slide,text,flush=True)
(Q/'audio-checks.json').write_text(json.dumps(dict(status='PASS decoding and authored silences; ASR samples require content inspection',chapters=records,asr_samples=samples,limits='Reconocimiento automático local: no sustituye una escucha humana ni acredita naturalidad percibida.'),ensure_ascii=False,indent=2))
