/* Road Library 2026 — QSUAR + Traffic Density aligned to Road_2026.xlsx */
(()=>{
const $=id=>document.getElementById(id), n=id=>parseFloat($(id)?.value)||0,
 f=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
const qsuarRows=[
{no:1,line:'IPD ASTA Barat - Front SW Barat',cap:'-',distance:2200,severity:'Good'},
{no:2,line:'Front SW Barat - PIT 5',cap:510,distance:600,severity:'Severity soft'},
{no:3,line:'Simpang Vienna - Front HW barat',cap:766,distance:1600,severity:'Good'},
{no:4,line:'Simpang Vienna - SW Timur',cap:256,distance:1550,severity:'Good - Soft'},
{no:5,line:'-',cap:'-',distance:0,severity:'Good'}];
const densityRows=[
[1,'Camp Nou',1.8,50.3,2,11,'DT Coal (2 Fleet)'],
[2,'Etihad',0.7,50.3,2,30,'OHT, ADT, DT OB (5 Fleet)'],
[3,'Emirates',0.2,50.3,2,22,'DT OB (1 Fleet) & Coal (3 Fleet), Secara actual 1.3 km yang digunakan CK 0.2 km'],
[4,'Marcana',1.3,50.3,2,22,'DT OB (1 Fleet) & Coal (3 Fleet)'],
[5,'Old Trafford',0.9,50.3,2,5,'DT Coal (1 Fleet)'],
[6,'GBK',0.7,50.3,2,'Tentative','Hanya digunakan pada akses ke soil atau parkir untuk istirahat/sholat) di pondok Operator']];
function road(){return document.querySelector('#road')}
function replaceQ(){
const c=road()?.querySelector('.road-grid');if(!c)return;
const old=[...c.querySelectorAll('.sub-card')].find(x=>/11D\. QSUAR/i.test(x.textContent));if(!old)return;
old.outerHTML=`<article class="sub-card" id="qsuar2026"><h3>11D. QSUAR / SCRAPPING TIME — ROAD_2026</h3>
<p class="helper">Mengikuti sheet <b>QSUAR_Rev</b>. Pilih LINE QSUAR untuk menghitung scrapping time tanpa menampilkan tabel data.</p>
<div class="form-list compact two-col">
<label><span>Kap. Grader (m²/jam)</span><input id="q26GraderCap" type="number" min="0" step="1" value="20073"></label>
<label><span>Lebar jalan Standar / Average (m)</span><input id="q26RoadWidth" type="number" min="0.1" step="0.1" value="25"></label>
<label><span>Loader Total Capacity/Hour — Small (BCM/jam)</span><input id="q26Small" type="number" min="0" step="0.01" value="802.92"></label>
<label><span>Loader Total Capacity/Hour — Large (BCM/jam)</span><input id="q26Large" type="number" min="0" step="0.01" value="802.92"></label>
<label><span>Jumlah Grader</span><select id="q26Graders"><option value="3">3 × Grader — P3 / P4</option><option value="2">2 × Grader — P1 / P2</option><option value="1">1 × Grader</option></select></label>
<label><span>LINE QSUAR</span><select id="q26Line"></select></label></div>
<div class="formula-box"><strong>RUMUS QSUAR / SCRAPPING TIME</strong><br>Kapasitas Grader = Kap. Grader (m²/jam) ÷ Lebar Jalan (m)<br>Scrapping Time = Distance (m) ÷ [Kapasitas Grader (BCM/jam) × Jumlah Grader]<br><small>Contoh Excel: 20.073 ÷ 25 = 802,92 BCM/jam.</small></div>
<div class="metric-grid"><div class="metric"><span>KAPASITAS GRADER</span><div class="metric-formula">m²/jam</div><strong id="q26CapOut">—</strong></div><div class="metric"><span>CAPACITY CONVERTED</span><div class="metric-formula">BCM/jam</div><strong id="q26BcmOut">—</strong></div><div class="metric"><span>DISTANCE</span><div class="metric-formula">m</div><strong id="q26DistanceOut">—</strong></div><div class="metric"><span>SCRAPPING TIME</span><div class="metric-formula">jam</div><strong id="q26TimeOut">—</strong></div></div>
<div class="formula-box"><strong>HIERARKI / PRIORITAS</strong><br><b>1. KAPASITAS</b> → <b>2. JARAK</b> → <b>3. SEVERITY</b><br><small>P2 dan P3 dapat berubah posisi berdasarkan score calculation. Pertimbangan lain: distance between area dan job priority (Finishing Pit / Mud Job / Coal Hauling / Coal Expose).</small></div></article>`;
const s=$('q26Line');qsuarRows.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${r.no}. ${r.line}`;s.appendChild(o)});
['q26GraderCap','q26RoadWidth','q26Small','q26Large','q26Graders','q26Line'].forEach(id=>$(id)?.addEventListener('input',qcalc));s.addEventListener('change',qcalc);qcalc();}
function qcalc(){if(!$('q26TimeOut'))return;const m2=n('q26GraderCap'),w=n('q26RoadWidth'),converted=w?m2/w:0,r=qsuarRows[Number($('q26Line')?.value)||0],g=n('q26Graders')||1;$('q26CapOut').textContent=f(m2,0);$('q26BcmOut').textContent=f(converted,2);$('q26DistanceOut').textContent=f(r.distance,0);$('q26TimeOut').textContent=converted&&r.distance?f(r.distance/(converted*g),3):'—';}
function replaceD(){
const c=road()?.querySelector('.road-grid');if(!c)return;const old=[...c.querySelectorAll('.sub-card')].find(x=>/11E\. ROAD DENSITY/i.test(x.textContent));if(!old)return;
old.outerHTML=`<article class="sub-card" id="density2026"><h3>11E. ROAD DENSITY / TRAFFIC DENSITY — ROAD_2026</h3><p class="helper">Formula dan data mengikuti sheet <b>Kepadatan Jalan</b>. Tabel data disembunyikan agar tampilan lebih ringkas.</p>
<div class="form-list compact two-col"><label><span>TL — Total panjang jalan (km)</span><input id="rd26TL" type="number" step="0.1" value="0.7"></label><label><span>Head Spacing (m)</span><input id="rd26Head" type="number" step="0.1" value="50.3"></label><label><span>Lane — Jumlah lajur</span><input id="rd26Lane" type="number" step="1" value="2"></label><label><span>Actual (Jumlah Unit)</span><input id="rd26Actual" type="number" step="1" value="30"></label>
<label><span>Preset Jalan</span><select id="rd26Preset"><option value="custom">Custom</option>${densityRows.map(r=>`<option value="${r[2]}|${r[3]}|${r[4]}|${typeof r[5]==='number'?r[5]:''}">${r[1]}</option>`).join('')}</select></label></div>
<div class="formula-box"><strong>RUMUS TRAFFIC DENSITY — EXCEL</strong><br><strong>Dmax = (1000 × TL × 0,8 × Lane) / Head Spacing</strong><br><small>Actual dibandingkan dengan Dmax. Tidak menambahkan panjang unit, sesuai formula Excel.</small></div>
<div class="metric-grid"><div class="metric"><span>MAX DENSITY (Dmax)</span><div class="metric-formula">unit</div><strong id="rd26Dmax">—</strong></div><div class="metric"><span>ACTUAL</span><div class="metric-formula">unit</div><strong id="rd26ActualOut">—</strong></div><div class="metric"><span>HEAD SPACING</span><div class="metric-formula">m</div><strong id="rd26HeadOut">—</strong></div><div class="metric"><span>STATUS</span><div class="metric-formula">comparison</div><strong id="rd26Status" class="status-chip">—</strong></div></div></article>`;
['rd26TL','rd26Head','rd26Lane','rd26Actual'].forEach(id=>$(id)?.addEventListener('input',dcalc));$('rd26Preset').addEventListener('change',()=>{const v=$('rd26Preset').value;if(v!=='custom'){const a=v.split('|');$('rd26TL').value=a[0];$('rd26Head').value=a[1];$('rd26Lane').value=a[2];if(a[3])$('rd26Actual').value=a[3]}dcalc()});dcalc();}
function dcalc(){if(!$('rd26Dmax'))return;const tl=n('rd26TL'),h=n('rd26Head'),lane=n('rd26Lane'),a=n('rd26Actual'),d=h?(1000*tl*.8*lane)/h:0;$('rd26Dmax').textContent=f(d,2);$('rd26ActualOut').textContent=f(a,0);$('rd26HeadOut').textContent=f(h,1);const st=$('rd26Status');st.textContent=a<=d?'OK — BELOW MAX':'OVER — ABOVE MAX';st.className='status-chip '+(a<=d?'ok':'bad');}
function init(){if(!road())return;replaceQ();replaceD()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
