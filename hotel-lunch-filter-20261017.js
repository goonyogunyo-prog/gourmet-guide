/* Progressive enhancement: static comparison remains readable with JS disabled. */
(()=>{'use strict';
const root=document.getElementById('hotel-lunch-tools');
const table=document.querySelector('#comparison ~ .table-scroll .comparison-table');
if(!root||!table||!table.tBodies[0])return;
const rows=[...table.tBodies[0].rows];const search=document.getElementById('lunch-keyword');const max=document.getElementById('lunch-max');const count=document.getElementById('lunch-result-count');const reset=document.getElementById('lunch-reset');const pair=document.getElementById('lunch-max-pair');const empty=document.getElementById('lunch-empty');
if(!search||!max||!pair||!count||!reset)return;
const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('ja-JP').replace(/\s+/g,'');
const money=s=>{const m=String(s||'').replace(/,/g,'').match(/([0-9]+)円/);return m?Number(m[1]):NaN;};
function update(){const query=normalize(search.value),ceiling=max.value?Number(max.value):Infinity,pairCeiling=pair.value?Number(pair.value):Infinity;let visible=0;
rows.forEach(row=>{const text=normalize(row.textContent||'');const price=money(row.cells[2]?.textContent||'');const two=money(row.cells[3]?.textContent||'');const ok=(!query||text.includes(query))&&Number.isFinite(price)&&price<=ceiling&&Number.isFinite(two)&&two<=pairCeiling;row.hidden=!ok;if(ok)visible++;});
count.textContent=`${visible} / ${rows.length} 店舗を表示中`;if(empty)empty.hidden=visible!==0;
}
search.addEventListener('input',update);max.addEventListener('change',update);pair.addEventListener('change',update);reset.addEventListener('click',()=>{search.value='';max.value='';pair.value='';update();search.focus();});root.hidden=false;update();
})();
