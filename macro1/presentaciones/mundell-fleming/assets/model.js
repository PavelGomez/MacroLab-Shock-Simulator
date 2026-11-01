(function(root){
 'use strict';
 const base={c0:100,c1:.75,T:80,b0:160,b1:.15,b2:15,G:200,x0:140,x1:.1,x2:.2,d1:.5,d2:50,m:1450,istar:4,E:900};
 function relations(changes={}){
  const p={...base,...changes},a=1-p.c1-p.b1+p.x1,A=p.c0-p.c1*p.T+p.b0+p.G+p.x0;
  return {p,IS:{yIntercept:(A+p.x2*p.E)/a,slope:-p.b2/a,iIntercept:(A+p.x2*p.E)/p.b2},LM:{yIntercept:p.m/p.d1,slope:p.d2/p.d1,iIntercept:-p.m/p.d2}};
 }
 function solve(regime,changes={}){
  const p={...base,...changes},a=1-p.c1-p.b1+p.x1,A=p.c0-p.c1*p.T+p.b0+p.G+p.x0,i=p.istar;
  if(!(a>0&&p.d1>0&&p.x2>0))throw Error('Parámetros no admisibles');
  const Y=regime==='float'?(p.m+p.d2*i)/p.d1:(A-p.b2*i+p.x2*p.E)/a;
  const E=regime==='float'?(a*Y-A+p.b2*i)/p.x2:p.E;
  const m=regime==='float'?p.m:p.d1*Y-p.d2*i;
  const C=p.c0+p.c1*(Y-p.T),I=p.b0+p.b1*Y-p.b2*i,XN=p.x0-p.x1*Y+p.x2*E;
  const X=210+.1*E,IM=70+.1*Y-.1*E;
  return {p,a,A,alpha:1/a,i,Y,E,m,C,I,XN,X,IM,G:p.G,residuals:[Y-C-I-p.G-XN,m-(p.d1*Y-p.d2*i),i-p.istar]};
 }
 const scenarios=[{label:'Base',regime:'float',changes:{}},{label:'Fiscal · flotación',regime:'float',changes:{G:220}},{label:'Monetaria · flotación',regime:'float',changes:{m:1550}},{label:'Fiscal · fijo',regime:'fixed',changes:{G:220}},{label:'Intento monetario · fijo',regime:'fixed',changes:{m:1550}},{label:'Práctica A',regime:'float',changes:{m:1500}},{label:'Práctica B',regime:'fixed',changes:{G:210}}].map(s=>({...s,result:solve(s.regime,s.changes)}));
 root.MF={base,solve,relations,scenarios};
})(typeof window!=='undefined'?window:globalThis);
