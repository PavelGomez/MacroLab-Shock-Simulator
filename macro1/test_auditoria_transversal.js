#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path");
const {JSDOM,VirtualConsole}=require("jsdom");
const html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8"),errors=[];
const vc=new VirtualConsole();vc.on("jsdomError",e=>errors.push(e.message));
const dom=new JSDOM(html,{runScripts:"dangerously",url:"http://localhost/macro1/index.html",pretendToBeVisual:true,virtualConsole:vc,beforeParse(win){
  win.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({width:10}),set:()=>true});
  win.Element.prototype.scrollIntoView=()=>{};win.URL.createObjectURL=()=>"blob:test";win.URL.revokeObjectURL=()=>{};win.HTMLAnchorElement.prototype.click=function(){};
}});
const L=dom.window.MacroLabLoop,failures=[];let checks=0;
function ok(value,label){checks+=1;if(!value)failures.push(label)}
ok(!errors.length,"la aplicación carga sin errores");
ok(L.evaluateNumericAnswer("2",2,{unit:"%",acceptProportion:true}).ok,"2 se acepta como 2%");
const proportion=L.evaluateNumericAnswer("0.02",2,{unit:"%",acceptProportion:true});
ok(proportion.ok&&proportion.canonical===2&&proportion.representation==="proportion","0.02 se normaliza a 2%");
ok(L.parseStudentNumber("2,00")===2,"se reconoce la coma decimal en campos de texto numérico");
ok(L.evaluateNumericAnswer("0,02",2,{unit:"%",acceptProportion:true}).ok,"0,02 se acepta como 2%");

const positions=[];
Object.values(L.GUIDED_DRILLS).forEach(drill=>drill.fields.forEach(field=>positions.push(field.options.findIndex(option=>option[0]===field.answer)+1)));
const counts=positions.reduce((acc,pos)=>(acc[pos]=(acc[pos]||0)+1,acc),{}),largest=Math.max(...Object.values(counts));
ok(new Set(positions).size>=3,"las respuestas de práctica ocupan al menos tres posiciones");
ok(largest/positions.length<=.45,`ninguna posición concentra más de 45% (${JSON.stringify(counts)})`);
Object.values(L.GUIDED_DIAGNOSTICS).forEach(config=>ok(config.probe.options.findIndex(option=>option[0]==="__concept_ok__")>0,"la alternativa conceptualmente correcta no aparece primera en el diagnóstico"));

L.selectClass("2");
const state=L.classState()["2"];
state.guidedDrillId="C2-DRILL-GROWTH";
state.fields={answerA:"0.02",answerB:"103",answerC:"192",testMechanism:"El deflactor es un índice de precios de la producción interna; el IPC sigue una canasta de consumo. La inflación es una tasa. El PNF es un flujo de ingresos de factores, no un stock acumulado, y distingue territorio de residencia.",guided_a:"2",guided_b:"rate",revisionDecisionA:"confirm",revisionDecisionB:"confirm",revisionDecisionC:"confirm",revisionDecisionExplanation:"confirm"};
state.feedback=L.scoreClassTest();
ok(state.feedback.checks.find(item=>item.key==="answerA").ok,"la evaluación base reconoce 0.02 como 2%");
const practice=L.guidedPracticeResult(state);
ok(practice.checks.find(item=>/crecimiento, deflactor y PNB/.test(item.label)).ok,"la revisión puede confirmar respuestas equivalentes sin copiarlas");
const report=L.guidedStudentReport(state,"sesion_con_practica_pendiente");
ok(/Crecimiento real \(%\): 0\.02 \(equivale a 2,00%\) · confirmada/.test(report),"el reporte conserva valor, unidad, interpretación y decisión");
ok(/Deflactor del PIB \(índice base 2018=100\)/.test(report)&&/PNB de 2019 \(precios de 2018\)/.test(report),"el reporte usa etiquetas semánticas y unidades");
ok(!/Resultados revisados: \(a\)/.test(report),"el reporte elimina la lista opaca a/b/c");

console.log(`Aserciones: ${checks} · fallos: ${failures.length}`);
if(failures.length){failures.forEach(item=>console.log("x "+item));process.exit(1)}
console.log("RESULTADO: OK");
