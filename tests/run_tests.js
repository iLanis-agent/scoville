/* Scoville tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const S=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it).slice(0,50)+' ';
  if(it.kind==='blend'){
    const r=S.blend(it.rows.map(x=>({id:x[0],grams:x[1]})));
    if((r===null&&it.oracle===null)||(r&&it.oracle&&r.shu===it.oracle.shu&&r.level===it.oracle.level&&r.totalGrams===it.oracle.totalGrams))ok();
    else bad(T,r,it.oracle);
  }else if(it.kind==='dilute'){
    const r=S.dilute(it.shu,it.mg,it.dg);
    if((r===null&&it.oracle===null)||(r&&it.oracle&&r.shu===it.oracle.shu&&r.level===it.oracle.level))ok();
    else bad(T,r,it.oracle);
  }else if(it.kind==='level'){
    if(S.level(it.shu)===it.oracle)ok(); else bad(T,S.level(it.shu),it.oracle);
  }else{
    const r=S.equivalent(it.shu);
    if(r.id===it.oracle)ok(); else bad(T+'equiv',r.id,it.oracle);
  }
}
// db sanity: ids unique, low<=high
const ids=S.list().map(p=>p.id);
if(new Set(ids).size===ids.length&&ids.length===13)pass++; else bad('db size',ids.length,13);
if(S.list().every(p=>p.low<=p.high))pass++; else bad('db range','bad','low<=high');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
