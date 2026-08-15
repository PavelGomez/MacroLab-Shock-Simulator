#!/usr/bin/env node
"use strict";

/* Casos pedagógicos de las rutas 1–3. La suite verifica la capa explicativa
   contra la evaluación base; no prueba un segundo sistema de puntuación. */
const fs=require("fs"),path=require("path");
const {JSDOM,VirtualConsole}=require("jsdom");
const LAB=path.join(__dirname,"index.html");
let assertions=0;const failures=[];
function ok(value,label){assertions+=1;if(!value)failures.push(`${assertions}. ${label}`);return Boolean(value)}
function eq(actual,expected,label){return ok(actual===expected,`${label} — esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(actual)}`)}
function boot(){
  const vc=new VirtualConsole(),errors=[];vc.on("jsdomError",e=>errors.push(e.message));vc.on("error",e=>errors.push(String(e)));
  const dom=new JSDOM(fs.readFileSync(LAB,"utf8"),{runScripts:"dangerously",url:"http://localhost/macro1/index.html",pretendToBeVisual:true,virtualConsole:vc,beforeParse(win){
    win.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>({width:10}),set:()=>true});
    win.Element.prototype.scrollIntoView=()=>{};win.URL.createObjectURL=()=>"blob:test";win.URL.revokeObjectURL=()=>{};win.HTMLAnchorElement.prototype.click=function(){};
  }});
  return {window:dom.window,errors};
}
const {window:w,errors}=boot(),L=w.MacroLabLoop;
ok(!errors.length,"la aplicación carga sin errores de consola");
eq(L.PEDAGOGICAL_FEEDBACK_SCHEMA,"macrolab-pedagogical-feedback/1.0","el esquema explicativo es estable y versionado");

function evaluate(classId,fields){
  L.selectClass(String(classId));
  const state=L.classState()[String(classId)];state.fields={...fields};
  const base=L.scoreClassTest(),feedback=L.buildPedagogicalFeedback(String(classId),state.fields,base);
  return {base,feedback,fields:state.fields};
}
function assertAligned(result,label){
  const {base,feedback,fields}=result;
  eq(feedback.base_evaluation.score,base.score,`${label} · conserva score base`);
  eq(feedback.base_evaluation.max,base.max,`${label} · conserva máximo base`);
  eq(feedback.base_evaluation.unchanged,true,`${label} · declara evaluación base sin cambios`);
  const expectedResult=base.score===base.max&&base.max?"logrado":base.score?"parcialmente_logrado":"por_mejorar";
  eq(feedback.result_general,expectedResult,`${label} · el resultado general no contradice la evaluación base`);
  feedback.criteria.forEach(criterion=>{
    ["criterion_id","name","status","expected","evidence","achieved","trace"].forEach(key=>ok(Object.hasOwn(criterion,key),`${label} · ${criterion.name} contiene ${key}`));
    ok(criterion.trace.question&&criterion.trace.rubric,`${label} · ${criterion.name} se rastrea a pregunta y pauta`);
    ok(criterion.trace.study_notes.length>=1,`${label} · ${criterion.name} se rastrea a una Nota de Estudio`);
    ok(criterion.trace.base_checks.length>=1,`${label} · ${criterion.name} se vincula con comprobación base`);
    if(criterion.evidence.mode==="exacta"){
      const raw=String(fields[criterion.evidence.source_field]??"");
      ok(raw.includes(criterion.evidence.quote),`${label} · la evidencia exacta de ${criterion.name} pertenece a la respuesta`);
    }
    if(criterion.status==="logrado"){
      eq(criterion.gap,null,`${label} · ${criterion.name} no inventa un faltante cuando está logrado`);
      eq(criterion.recommendation,null,`${label} · ${criterion.name} no fuerza una mejora artificial`);
    }else{
      ok(criterion.gap&&criterion.gap.detail.length>15,`${label} · ${criterion.name} explica qué falta`);
      ok(/^(Agrega|Añade|Repite|Escribe|Reconstruye|Calcula|Corrige|Sustituye|Cambia|Reemplaza)/.test(criterion.recommendation),`${label} · ${criterion.name} propone una acción ejecutable`);
      ok(criterion.rationale&&criterion.rationale.length>25,`${label} · ${criterion.name} explica por qué se exige`);
      ok(/^Ejemplo:/.test(criterion.example),`${label} · ${criterion.name} identifica el ejemplo orientador`);
    }
  });
  const serialized=JSON.stringify(feedback);
  ok(!/(econometr[ií]a|citar autores|bibliograf[ií]a obligatoria)/i.test(serialized),`${label} · no introduce exigencias ajenas a la pauta`);
  ok(!/(prompt del sistema|razonamiento interno|system message)/i.test(serialized),`${label} · no expone instrucciones internas`);
}

const correct1=evaluate(1,{bridgeEvidence:"projection",bridgeClaim:"scenario",testProse:"La afirmación es falsa. El IPoM presenta una proyección del PIB para 2026 y el resultado todavía no está observado. La cifra no demuestra una causa: se necesita un mecanismo y evidencia adicional para descartar otras explicaciones."});
eq(correct1.base.score,correct1.base.max,"Clase 1 · respuesta completamente correcta");
ok(correct1.feedback.criteria.every(x=>x.status==="logrado"),"Clase 1 · todos los criterios quedan logrados");
assertAligned(correct1,"Clase 1 correcta");

const differentWords=evaluate(1,{bridgeEvidence:"projection",bridgeClaim:"scenario",testProse:"Es una estimación del informe IPoM para el año 2026. Todavía no conocemos el dato final. Para atribuirlo a una medida habría que mostrar el mecanismo y contrastarlo con evidencia adicional."});
eq(differentWords.base.score,differentWords.base.max,"Clase 1 · reconoce una respuesta correcta con vocabulario distinto de la pauta");
ok(differentWords.feedback.criteria.find(x=>x.criterion_id==="C1-EVIDENCE-STATUS").evidence.quote.includes("estimación"),"Clase 1 · vincula el sinónimo usado por el estudiante");
assertAligned(differentWords,"Clase 1 con vocabulario alternativo");

const brief=evaluate(1,{bridgeEvidence:"",bridgeClaim:"",testProse:"Tal vez."});
eq(brief.feedback.result_general,"por_mejorar","respuesta muy breve o ambigua queda por mejorar");
ok(brief.feedback.criteria.some(x=>x.gap&&x.gap.type==="respuesta_ambigua"),"respuesta breve se distingue de una ausencia total");
assertAligned(brief,"Clase 1 breve");

const empty=evaluate(1,{bridgeEvidence:"",bridgeClaim:"",testProse:""});
eq(empty.base.score,0,"respuesta vacía no obtiene comprobaciones base");
ok(empty.feedback.criteria.every(x=>x.evidence.mode==="no_encontrada"),"respuesta vacía no genera citas inventadas");
ok(empty.feedback.criteria.every(x=>x.gap.type==="ausencia"),"respuesta vacía se clasifica como ausencia");
assertAligned(empty,"Clase 1 vacía");

// Caso reproducido del reporte revisado: la institución y el año son avances,
// pero no sustituyen el nombre de la publicación específica (IPoM).
L.selectClass("1");
const reportState=L.classState()["1"];
reportState.guidedDrillId="C1-DRILL-EVIDENCE";
reportState.fields={
  bridgeEvidence:"projection",bridgeClaim:"scenario",
  testProse:"Bajo supuestos se espera un crecimiento de 2%. No puede afirmarse una causa específica.",
  guided_a:"projection",guided_b:"passport",guided_c:"scenario",guided_d:"mechanism",
  revisionDecision:"keep",revision_projection:"El 2% es una proyección.",revision_observed:"Porque aún no termina el año.",
  revision_metadata:"Banco Central para el año 2026",revision_causality:"No puede afirmarse una causa específica."
};
reportState.feedback=L.scoreClassTest();
reportState.explanatoryFeedback=L.buildPedagogicalFeedback("1",reportState.fields,reportState.feedback);
const practice=L.guidedPracticeResult(reportState),metadataPractice=practice.checks.find(x=>x.criterionId==="metadata");
eq(metadataPractice.status,"parcialmente_logrado","Clase 1 · Banco Central y 2026 se reconocen como avance parcial");
eq(metadataPractice.ok,false,"Clase 1 · la institución no se confunde con la fuente específica IPoM");
ok(metadataPractice.achieved.includes("Banco Central")&&metadataPractice.achieved.includes("2026"),"Clase 1 · indica exactamente qué elementos sí escribió el estudiante");
ok(metadataPractice.missing.includes("IPoM")&&/institución/.test(metadataPractice.missing),"Clase 1 · explica la diferencia entre institución y publicación");
const studentReport=L.guidedStudentReport(reportState,"sesion_con_practica_pendiente");
ok(/Práctica para completar tu respuesta/.test(studentReport)&&/Parcialmente logrado/.test(studentReport),"Clase 1 · la sección 7 comunica el estado parcial con lenguaje directo");
ok(/«Banco Central para el año 2026»/.test(studentReport),"Clase 1 · la sección 7 cita únicamente el fragmento escrito por el estudiante");
ok(/El IPoM del Banco Central proyecta que el PIB de Chile crecerá 2% durante 2026/.test(studentReport),"Clase 1 · entrega una mejora concreta y breve");
ok(!/identidad del dato|completar sus metadatos|respuesta acumulada incluye|afirmación defendible/i.test(studentReport),"Clase 1 · el reporte evita etiquetas internas o abstractas no explicadas");
ok(/desactiva «Encabezados y pies de página»/.test(studentReport),"reporte · explica cómo evitar la dirección local al imprimir");
const causalInitial=reportState.explanatoryFeedback.criteria.find(x=>x.criterion_id==="C1-EVIDENCE-CAUSALITY");
ok(!/señalaste que hace falta un mecanismo o evidencia adicional/i.test(causalInitial.achieved),"Clase 1 · no atribuye al estudiante una explicación que no escribió");

const correct2=evaluate(2,{answerA:"2",answerB:"103",answerC:"192",testMechanism:"El deflactor cubre los precios de la producción interna; el IPC sigue el consumo de las familias mediante una canasta. El PNF es un flujo neto de ingresos de factores del período, no un stock acumulado de inversión."});
eq(correct2.base.score,correct2.base.max,"Clase 2 · respuesta completamente correcta");
assertAligned(correct2,"Clase 2 correcta");

const partial2=evaluate(2,{answerA:"2",answerB:"100",answerC:"192",testMechanism:"El PNF es un flujo de ingresos de factores durante el período, no un stock acumulado."});
eq(partial2.feedback.result_general,"parcialmente_logrado","Clase 2 · respuesta parcialmente correcta");
ok(partial2.feedback.criteria.some(x=>x.status==="logrado")&&partial2.feedback.criteria.some(x=>x.status==="por_mejorar"),"Clase 2 · varios criterios separan cumplidos y pendientes");
assertAligned(partial2,"Clase 2 parcial");

const conceptualError=evaluate(2,{answerA:"2",answerB:"103",answerC:"192",testMechanism:"El deflactor es igual al IPC y ambos siguen una canasta de consumo y la producción. El PNF es el stock de inversión extranjera acumulada."});
const priceError=conceptualError.feedback.criteria.find(x=>x.criterion_id==="C2-PRICE-COVERAGE"),pnfError=conceptualError.feedback.criteria.find(x=>x.criterion_id==="C2-PNF-FLOW");
eq(priceError.gap.type,"error_conceptual","Clase 2 · identifica un error conceptual concreto sobre deflactor e IPC");
eq(pnfError.gap.type,"error_conceptual","Clase 2 · identifica un error conceptual concreto sobre PNF");
ok(priceError.evidence.quote.includes("deflactor es igual"),"Clase 2 · cita la afirmación errónea exacta");
assertAligned(conceptualError,"Clase 2 con error conceptual");

const correct3=evaluate(3,{answerA:"950",answerB:"1050",testMechanism:"Al subir G, el gasto planeado supera la producción y caen los inventarios no planeados. Las empresas elevan la producción y el ingreso; el mayor ingreso aumenta el consumo hasta el nuevo equilibrio."});
eq(correct3.base.score,correct3.base.max,"Clase 3 · respuesta completamente correcta");
assertAligned(correct3,"Clase 3 correcta");

const mentionWithoutMechanism=evaluate(3,{answerA:"950",answerB:"1050",testMechanism:"El consumo aumenta."});
eq(mentionWithoutMechanism.feedback.criteria.find(x=>x.criterion_id==="C3-CONSUMPTION-FEEDBACK").status,"por_mejorar","Clase 3 · mencionar consumo no equivale a explicar su mecanismo");
ok(mentionWithoutMechanism.feedback.criteria.find(x=>x.criterion_id==="C3-CONSUMPTION-FEEDBACK").evidence.quote.includes("consumo"),"Clase 3 · conserva la mención concreta aunque la relación esté incompleta");
ok(mentionWithoutMechanism.feedback.criteria.find(x=>x.criterion_id==="C3-INVENTORIES").gap.type==="mecanismo_ausente","Clase 3 · distingue mención aislada de mecanismo completo");
assertAligned(mentionWithoutMechanism,"Clase 3 sin mecanismo");

const mixed3=evaluate(3,{answerA:"950",answerB:"1050",testMechanism:"Al aumentar G caen los inventarios no planeados."});
eq(mixed3.feedback.result_general,"parcialmente_logrado","Clase 3 · evaluación multicriterio mixta");
ok(mixed3.feedback.criteria.filter(x=>x.status==="logrado").length===3,"Clase 3 · conserva dos cálculos y un mecanismo cumplidos");
ok(mixed3.feedback.criteria.filter(x=>x.status!=="logrado").length===2,"Clase 3 · separa dos mecanismos pendientes");
assertAligned(mixed3,"Clase 3 mixta");

const wrong3=evaluate(3,{answerA:"0",answerB:"0",testMechanism:"El gasto público reduce el equilibrio."});
eq(wrong3.feedback.result_general,"por_mejorar","Clase 3 · respuesta incorrecta queda por mejorar");
assertAligned(wrong3,"Clase 3 incorrecta");

const inventoryError=evaluate(3,{answerA:"950",answerB:"1050",testMechanism:"Cuando aumenta G, los inventarios aumentan y después sube la producción, el ingreso y el consumo."});
const inventoryCriterion=inventoryError.feedback.criteria.find(x=>x.criterion_id==="C3-INVENTORIES");
eq(inventoryCriterion.gap.type,"error_conceptual","Clase 3 · distingue dirección conceptual equivocada de una ausencia");
ok(inventoryCriterion.recommendation.includes("dirección de los inventarios"),"Clase 3 · recomienda corregir el mecanismo concreto");
assertAligned(inventoryError,"Clase 3 con error conceptual");

const noCriterion=evaluate(3,{answerA:"950",answerB:"1050",testMechanism:"Los inventarios caen."});
const absentConsumption=noCriterion.feedback.criteria.find(x=>x.criterion_id==="C3-CONSUMPTION-FEEDBACK");
eq(absentConsumption.evidence.mode,"no_encontrada","criterio no abordado declara ausencia de fragmento pertinente");
eq(absentConsumption.gap.type,"relacion_causal_incompleta","criterio no abordado explica la relación causal faltante");
assertAligned(noCriterion,"Clase 3 sin un criterio");

const rendered=L.renderPedagogicalFeedback(mixed3.feedback),container=w.document.createElement("div");container.innerHTML=rendered;
ok(/Resultado general/.test(container.textContent)&&/Idea principal/.test(container.textContent)&&/Tu próximo paso/.test(container.textContent),"la presentación comienza con el resumen solicitado");
ok(container.querySelectorAll(".criterion-feedback").length===mixed3.feedback.criteria.length,"la presentación muestra un bloque por criterio");
ok(/Se esperaba/.test(container.textContent)&&/En tu respuesta identificamos/.test(container.textContent)&&/Cumpliste/.test(container.textContent)&&/Aún falta/.test(container.textContent)&&/Esto es importante porque/.test(container.textContent)&&/Para mejorarlo/.test(container.textContent)&&/Ejemplo orientador/.test(container.textContent),"el detalle contiene los siete componentes pedagógicos");
ok(!/C3-|c3-/.test(container.textContent),"la vista estudiantil no expone códigos internos");

console.log("─".repeat(72));
console.log("test_retroalimentacion_pedagogica.js — capa explicativa Clases 1–3");
console.log("─".repeat(72));
console.log(`\nAserciones: ${assertions} · fallos: ${failures.length}`);
if(failures.length){failures.forEach(f=>console.log("  x "+f));console.log("RESULTADO: FALLA");process.exit(1)}
console.log("RESULTADO: OK");
