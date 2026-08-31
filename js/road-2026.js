/* Road Library 2026 — QSUAR + Traffic Density aligned to Road_2026.xlsx */
(()=>{
const $=id=>document.getElementById(id), n=id=>parseFloat($(id)?.value)||0,
f=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
function road(){return document.querySelector('#road')}
function replaceQ(){
const c=road()?.querySelector('.road-grid');if(!c)return;
const old=[...c.querySelectorAll('.sub-card')].find(x=>/11D\. QSUAR/i.test(x.textContent));if(!old)return;
old.outerHTML=`<article class="sub-card" id="qsuar2026"><h3>11D. QSUAR / SCRAPPING TIME — ROAD_2026</h3>
<p class="helper">Masukkan <b>Distance QSUAR</b> secara langsung. Tidak menampilkan tabel LINE QSUAR.</p>
<div class="form-list compact two-col">
<label><span>Kap. Grader (m²/jam)</span><input id="q26GraderCap" type="number" min="0" step="1" value="20073"></label>
<label><span>Lebar jalan Standar / Average (m)</span><input id="q26RoadWidth" type="number" min="0.1" step="0.1" value="25"></label>
<label><span>Loader Total Capacity/Hour — Small (BCM/jam)</span><input id="q26Small" type="number" min="0" step="0.01" value="802.92"></label>
<label><span>Loader Total Capacity/Hour — Large (BCM/jam)</span><input id="q26Large" type="number" min="0" step="0.01" value="802.92"></label>
<label><span>Jumlah Grader</span><select id="q26Graders"><option value="3">3 × Grader — P3 / P4</option><option value="2">2 × Grader — P1 / P2</option><option value="1">1 × Grader</option></select></label>
<label><span>Distance QSUAR (m)</span><input id="q26Distance" type="number" min="0" step="1" value="600"></label></div>
<div class="formula-box"><strong>RUMUS QSUAR / SCRAPPING TIME</strong><br>Kapasitas Grader = Kap. Grader (m²/jam) ÷ Lebar Jalan (m)<br>Scrapping Time = Distance (m) ÷ [Kapasitas Grader (BCM/jam) × Jumlah Grader]<br><small>Contoh Excel: 20.073 ÷ 25 = 802,92 BCM/jam.</small></div>
<div class="metric-grid"><div class="metric"><span>KAPASITAS GRADER</span><div class="metric-formula">m²/jam</div><strong id="q26CapOut">—</strong></div><div class="metric"><span>CAPACITY CONVERTED</span><div class="metric-formula">BCM/jam</div><strong id="q26BcmOut">—</strong></div><div class="metric"><span>DISTANCE</span><div class="metric-formula">m</div><strong id="q26DistanceOut">—</strong></div><div class="metric"><span>SCRAPPING TIME</span><div class="metric-formula">jam</div><strong id="q26TimeOut">—</strong></div></div>
<div class="formula-box"><strong>HIERARKI / PRIORITAS</strong><br><b>1. KAPASITAS</b> → <b>2. JARAK</b> → <b>3. SEVERITY</b><br><small>P2 dan P3 dapat berubah posisi berdasarkan score calculation. Pertimbangan lain: distance between area dan job priority (Finishing Pit / Mud Job / Coal Hauling / Coal Expose).</small></div></article>`;
['q26GraderCap','q26RoadWidth','q26Small','q26Large','q26Graders','q26Distance'].forEach(id=>$(id)?.addEventListener('input',qcalc));
$('q26Graders')?.addEventListener('change',qcalc);qcalc();}
function qcalc(){if(!$('q26TimeOut'))return;const m2=n('q26GraderCap'),w=n('q26RoadWidth'),converted=w?m2/w:0,distance=n('q26Distance'),g=n('q26Graders')||1;$('q26CapOut').textContent=f(m2,0);$('q26BcmOut').textContent=f(converted,2);$('q26DistanceOut').textContent=f(distance,0);$('q26TimeOut').textContent=converted&&distance?f(distance/(converted*g),3):'—';}
function replaceD(){
const c=road()?.querySelector('.road-grid');if(!c)return;const old=[...c.querySelectorAll('.sub-card')].find(x=>/11E\. ROAD DENSITY/i.test(x.textContent));if(!old)return;
old.outerHTML=`<article class="sub-card" id="density2026"><h3>11E. ROAD DENSITY / TRAFFIC DENSITY — ROAD_2026</h3><p class="helper">Masukkan <b>Nama Hauler</b> secara bebas. Nama ini hanya sebagai identitas perhitungan.</p>
<div class="form-list compact two-col"><label><span>Nama Hauler</span><input id="rd26Hauler" type="text" placeholder="Contoh: DT Coal Fleet 1"></label><label><span>TL — Total panjang jalan (km)</span><input id="rd26TL" type="number" step="0.1" value="0.7"></label><label><span>Head Spacing (m)</span><input id="rd26Head" type="number" step="0.1" value="50.3"></label><label><span>Lane — Jumlah lajur</span><input id="rd26Lane" type="number" step="1" value="2"></label><label><span>Actual (Jumlah Unit)</span><input id="rd26Actual" type="number" step="1" value="30"></label></div>
<div class="formula-box"><strong>RUMUS TRAFFIC DENSITY — EXCEL</strong><br><strong>Dmax = (1000 × TL × 0,8 × Lane) / Head Spacing</strong><br><small>Actual dibandingkan dengan Dmax. Tidak menambahkan panjang unit, sesuai formula Excel.</small></div>
<div class="metric-grid"><div class="metric"><span>HAULER</span><div class="metric-formula">nama</div><strong id="rd26HaulerOut">—</strong></div><div class="metric"><span>MAX DENSITY (Dmax)</span><div class="metric-formula">unit</div><strong id="rd26Dmax">—</strong></div><div class="metric"><span>ACTUAL</span><div class="metric-formula">unit</div><strong id="rd26ActualOut">—</strong></div><div class="metric"><span>STATUS</span><div class="metric-formula">comparison</div><strong id="rd26Status" class="status-chip">—</strong></div></div></article>`;
['rd26TL','rd26Head','rd26Lane','rd26Actual','rd26Hauler'].forEach(id=>$(id)?.addEventListener('input',dcalc));dcalc();}
function dcalc(){if(!$('rd26Dmax'))return;const tl=n('rd26TL'),h=n('rd26Head'),lane=n('rd26Lane'),a=n('rd26Actual'),d=h?(1000*tl*.8*lane)/h:0;$('rd26HaulerOut').textContent=$('rd26Hauler')?.value?.trim()||'—';$('rd26Dmax').textContent=f(d,2);$('rd26ActualOut').textContent=f(a,0);const st=$('rd26Status');st.textContent=a<=d?'OK — BELOW MAX':'OVER — ABOVE MAX';st.className='status-chip '+(a<=d?'ok':'bad');}
function init(){if(!road())return;replaceQ();replaceD()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
