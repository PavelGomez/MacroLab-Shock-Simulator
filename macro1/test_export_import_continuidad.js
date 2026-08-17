#!/usr/bin/env node
"use strict";

const fs=require("fs"),path=require("path");
const {JSDOM,VirtualConsole}=require("jsdom");
const LAB=path.join(__dirname,"index.html");
let assertions=0;const failures=[];
function ok(value,label){assertions+=1;if(!value)failures.push(`${assertions}. ${label}`);return Boolean(value)}
function eq(actual,expected,label){return ok(actual===expected,`${label} — esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(actual)}`)}
function boot(){
  const errors=[],downloads=[],vc=new VirtualConsole();vc.on("jsdomError",e=>errors.push(e.message));vc.on("error",e=>errors.push(String(e)));
  const dom=new JSDOM(fs.readFileSync(LAB,"utf8"),{runScripts:"dangerously",url:"http://localhost/macro1/index.html#route",pretendToBeVisual:true,virtualConsole:vc,beforeParse(win){
    win.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({width:10}),set:()=>true});
    win.Element.prototype.scrollIntoView=()=>{};win.URL.createObjectURL=()=>"blob:test";win.URL.revokeObjectURL=()=>{};win.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download)};
  }});
  return {window:dom.window,errors,downloads};
}
const tick=(ms=0)=>new Promise(resolve=>setTimeout(resolve,ms));
function sessionPayload(classId){
  const {window:w}=boot(),L=w.MacroLabLoop;L.selectClass(String(classId));
  const state=L.classState()[String(classId)];
  state.guidedDrillId=classId===1?"C1-DRILL-EVIDENCE":"C2-DRILL-COVERAGE";
  state.fields=classId===1
    ? {testProse:"Una proyección del IPoM para 2026 no es un resultado observado ni demuestra una causa.",guided_a:"projection",guided_b:"passport",guided_c:"scenario",guided_d:"mechanism"}
    : {testProse:"Cálculo inicial",guided_a:"above",guided_b:"previous",revisedA:"2",revisedB:"103",revisedC:"192",revisedAnswer:"El deflactor es un índice, el IPC usa una canasta, el PNF es un flujo, PIB usa territorio y PNB residencia."};
  return {payload:L.guidedPayload(state,"rutina_completada"),report:L.guidedStudentReport(state,"rutina_completada")};
}

(async()=>{
  const {window:w,errors}=boot(),L=w.MacroLabLoop;
  eq(errors.length,0,"la aplicación carga sin errores");

  const c1=sessionPayload(1),parsed1=L.parseImportedLearningFile(JSON.stringify(c1.payload));
  eq(parsed1.ok,true,"el JSON exportado por Clase 1 se reconoce");eq(parsed1.classId,1,"se recupera Clase 1");eq(parsed1.classId+1,2,"propone Clase 2");
  const c2=sessionPayload(2),parsed2=L.parseImportedLearningFile(JSON.stringify(c2.payload));
  eq(parsed2.ok,true,"el JSON exportado por Clase 2 se reconoce");eq(parsed2.classId+1,3,"propone Clase 3");
  eq(c1.payload.schema_version,"macrolab-macro1-class-session/1.1","se conserva el esquema 1.1 existente");
  eq(L.parseImportedLearningFile(JSON.stringify({schema_version:"macrolab-macro1-class-session/1.1",class_id:1,closure:"rutina_completada",answers:{},training:{}})).ok,true,"un JSON 1.1 anterior con la estructura mínima sigue funcionando");
  ok(/^<!doctype html>/.test(c1.report)&&/window\.print/.test(c1.report),"el reporte HTML de Clase 1 sigue siendo imprimible");
  ok(/^<!doctype html>/.test(c2.report)&&/Mi reporte de aprendizaje · Clase 2/.test(c2.report),"el reporte HTML de Clase 2 sigue generándose");

  const learning=L.Learning.toObject(),parsedLearning=L.parseImportedLearningFile(JSON.stringify(learning));
  eq(parsedLearning.kind,"learning_context","la memoria 0.2 conserva su reconocimiento");
  eq(L.importLearningRecordText(JSON.stringify(learning)).ok,true,"Learning.fromObject conserva el flujo vigente");

  const stateBefore=JSON.stringify(L.classState()),learningBefore=JSON.stringify(L.Learning.toObject());
  ["%PDF-1.7", "<!doctype html><html></html>", "{mal", JSON.stringify({schema_version:"desconocido/9"})].forEach((text,index)=>{
    eq(L.parseImportedLearningFile(text).ok,false,`archivo inválido ${index+1} se rechaza`);
    eq(JSON.stringify(L.classState()),stateBefore,`archivo inválido ${index+1} no modifica controles`);
    eq(JSON.stringify(L.Learning.toObject()).replace(/"generated_at":"[^"]+"/,""),learningBefore.replace(/"generated_at":"[^"]+"/,""),`archivo inválido ${index+1} no modifica Learning`);
  });

  const {window:wEntry}=boot(),E=wEntry.MacroLabLoop,input=wEntry.document.querySelector("#entryFile");
  const before=JSON.stringify(E.classState());
  const file=new wEntry.File([JSON.stringify(c1.payload)],"MacroLab_Clase1_continuidad.json",{type:"application/json"});
  Object.defineProperty(input,"files",{value:[file],configurable:true});input.dispatchEvent(new wEntry.Event("change",{bubbles:true}));await tick(20);
  ok(/Clase recuperada/.test(wEntry.document.querySelector("#routeEntry").textContent),"la interfaz muestra la clase recuperada");
  ok(/Estado de cierre/.test(wEntry.document.querySelector("#routeEntry").textContent),"la interfaz muestra el cierre");
  ok(/Continuar en la Clase 2/.test(wEntry.document.querySelector("#entryContinue").textContent),"la interfaz ofrece el destino correcto");
  eq(JSON.stringify(E.classState()),before,"importar una sesión no restaura campos ni desbloqueos");
  wEntry.document.querySelector("#entryContinue").click();eq(E.activeClass(),"2","la continuidad abre Clase 2 desde su estado limpio");eq(E.classState()["2"].unlocked,0,"Clase 2 comienza en el paso 1");

  const {window:wEntry2}=boot(),input2=wEntry2.document.querySelector("#entryFile"),file2=new wEntry2.File([JSON.stringify(c2.payload)],"MacroLab_Clase2_continuidad.json",{type:"application/json"});
  Object.defineProperty(input2,"files",{value:[file2],configurable:true});input2.dispatchEvent(new wEntry2.Event("change",{bubbles:true}));await tick(20);
  ok(/Continuar en la Clase 3/.test(wEntry2.document.querySelector("#entryContinue").textContent),"la importación de Clase 2 ofrece continuar en Clase 3");

  const {window:wUi,downloads}=boot(),uiState=wUi.MacroLabLoop.classState()["1"];wUi.document.querySelector("#entryFresh").click();uiState.step=5;uiState.unlocked=5;uiState.guidedDrillId="C1-DRILL-EVIDENCE";wUi.MacroLabLoop.selectClass("1");
  const ui=wUi.document.querySelector("#classWorkbench").textContent;
  ok(/Descargar archivo para continuar \(\.json\)/.test(ui),"la continuidad JSON es una acción visible");
  ok(/PDF y el HTML.*no se pueden importar/.test(ui),"la interfaz diferencia reporte y continuidad");
  ok(/Continuar con un archivo de aprendizaje/.test(w.document.querySelector("#routeEntry").textContent),"la entrada usa un nombre inequívoco");
  wUi.MacroLabLoop.handleClassAction("exportJson");
  eq(downloads.pop(),"MacroLab_Clase1_continuidad.json","el archivo de continuidad usa un nombre claro");
  uiState.guidedPassed=true;wUi.MacroLabLoop.handleClassAction("export");
  eq(downloads.pop(),"MacroLab_Clase1_reporte_completado.html","el reporte completado conserva su nombre claro");

  if(failures.length){failures.forEach(f=>console.error("x "+f));process.exit(1)}
  console.log(`test_export_import_continuidad.js — ${assertions} aserciones · RESULTADO: OK`);
})().catch(err=>{console.error(err.stack||err);process.exit(1)});
