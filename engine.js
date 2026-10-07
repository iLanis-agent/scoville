/* Scoville engine: pepper heat database, blend math, dilution math.
   SHU ranges from published reference values (pepper breed references, hot
   sauce maker specs); individual pods vary. Pure JS, browser + Node. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.Scoville=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
var PEPPERS=[
 {id:'bell',name:'Bell Pepper',low:0,high:0,note:'Zero heat, all crunch.'},
 {id:'poblano',name:'Poblano',low:1000,high:2000,note:'Mild, earthy; dried it becomes ancho.'},
 {id:'jalapeno',name:'Jalapeno',low:2500,high:8000,note:'The grocery-store benchmark.'},
 {id:'sriracha',name:'Sriracha (sauce)',low:1000,high:2500,note:'Sauce form of red jalapenos.'},
 {id:'tabasco',name:'Tabasco (sauce)',low:2500,high:5000,note:'Aged tabasco peppers in vinegar.'},
 {id:'serrano',name:'Serrano',low:10000,high:23000,note:'Bright and crisp, a step up from jalapeno.'},
 {id:'cayenne',name:'Cayenne',low:30000,high:50000,note:'The classic dried-powder pepper.'},
 {id:'thai',name:'Thai Bird Chili',low:50000,high:100000,note:'Small pod, serious kick.'},
 {id:'habanero',name:'Habanero',low:100000,high:350000,note:'Fruity and fiercely hot.'},
 {id:'scotch',name:'Scotch Bonnet',low:100000,high:350000,note:'Caribbean cousin of the habanero.'},
 {id:'ghost',name:'Ghost Pepper (Bhut Jolokia)',low:855000,high:1041427,note:'First pepper to break 1M SHU.'},
 {id:'scorpion',name:'Trinidad Scorpion',low:1200000,high:2000000,note:'Sting-shaped tail, brutal heat.'},
 {id:'reaper',name:'Carolina Reaper',low:1400000,high:2200000,note:'Guinness record holder (avg 1.64M).'}
];
var LEVELS=[
 {max:0,label:'No heat'},
 {max:500,label:'Trace'},
 {max:2500,label:'Mild'},
 {max:10000,label:'Medium'},
 {max:50000,label:'Hot'},
 {max:150000,label:'Very hot'},
 {max:600000,label:'Extreme'},
 {max:Infinity,label:'Superhot'}
];
function list(){return PEPPERS;}
function byId(id){for(var i=0;i<PEPPERS.length;i++)if(PEPPERS[i].id===id)return PEPPERS[i];return null;}
function mid(p){return (p.low+p.high)/2;}
function level(shu){
  for(var i=0;i<LEVELS.length;i++)if(shu<=LEVELS[i].max)return LEVELS[i].label;
  return LEVELS[LEVELS.length-1].label;
}
/* blend: rows [{id, grams}] -> weighted-average SHU by mass (midpoint values) */
function blend(rows){
  var total=0,heat=0,used=[];
  for(var i=0;i<rows.length;i++){
    var p=byId(rows[i].id),g=parseFloat(rows[i].grams);
    if(!p||!(g>0))continue;
    total+=g;heat+=mid(p)*g;used.push({id:p.id,name:p.name,grams:g,shu:mid(p)});
  }
  if(total===0)return null;
  var shu=heat/total;
  return {shu:Math.round(shu),level:level(shu),totalGrams:total,rows:used};
}
/* dilution: grams of mash at shu into grams of (mild) dish -> final SHU */
function dilute(shu,mashGrams,dishGrams){
  if(!(shu>=0)||!(mashGrams>0)||!(dishGrams>0))return null;
  var final=shu*mashGrams/(mashGrams+dishGrams);
  return {shu:Math.round(final),level:level(final)};
}
/* nearest everyday pepper for a SHU value (by midpoint distance) */
function equivalent(shu){
  var best=null,bd=Infinity;
  for(var i=0;i<PEPPERS.length;i++){
    var m=mid(PEPPERS[i]);
    var d=Math.abs(m-shu)/(m+1);
    if(d<bd){bd=d;best=PEPPERS[i];}
  }
  return best?{id:best.id,name:best.name}:{id:null,name:'none'};
}
return {list:list,byId:byId,level:level,blend:blend,dilute:dilute,equivalent:equivalent};
});
