/* Visible Formula Layer — Support Equipment + Road */
(()=>{
  const $=id=>document.getElementById(id);
  const n=id=>{const v=String($(id)?.value??'').trim().replace(/\s/g,'').replace(',','.');const x=parseFloat(v);return Number.isFinite(x)?x:0};
  const f=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const fmtUnit=(v,u)=>`<b>${f(v)} ${u}</b>`;
  function addFormula(outputId, htmlFn, key){
    const out=$(outputId); if(!out) return;
    const card=out.closest('.sub-card,.tool-card,.calc-card,.module-section,article,section')||out.parentElement; if(!card) return;
    let box=card.querySelector(`[data-formula-box="${key}"]`);
    if(!box){box=document.createElement('div');box.className='formula-calc';box.dataset.formulaBox=key;box.innerHTML='<strong>RUMUS & SUBSTITUSI</strong><br>—';out.parentElement?.insertAdjacentElement('beforebegin',box);}
    const run=()=>{box.innerHTML='<strong>RUMUS & SUBSTITUSI</strong><br>'+htmlFn()};
    card.querySelectorAll('input,select').forEach(x=>{x.addEventListener('input',run);x.addEventListener('change',run)}); run();
  }
  function install(){
    addFormula('dzOut',()=>{const B=n('dzB'),H=n('dzH'),D=n('dzD'),Fb=n('dzFb'),Vf=n('dzVf'),Vr=n('dzVr'),Z=n('dzZ'),E=n('dzE');const q=B*H*D*Fb,ct=D/Vf+D/Vr+Z,v=ct?(q*60*E)/ct:NaN;return `Q = (B × H × D × Fb × 60 × E) ÷ CT<br>Q = (${f(B)} × ${f(H)} × ${f(D)} × ${f(Fb)} × 60 × ${f(E)}) ÷ ${f(ct)} = ${Number.isFinite(v)?fmtUnit(v,'m³/jam'):'—'}`},'dozer');
    addFormula('grOut',()=>{const P=n('grP'),J=n('grJ'),Vf=n('grVf'),Vr=n('grVr'),Z=n('grZ'),E=n('grE'),FK=n('grFK');const ct=J/Vf+J/Vr+Z,v=ct?(P**2*J*60*E*FK)/ct:NaN;return `Q = (P² × J × 60 × E × FK) ÷ CT<br>Q = (${f(P)}² × ${f(J)} × 60 × ${f(E)} × ${f(FK)}) ÷ ${f(ct)} = ${Number.isFinite(v)?fmtUnit(v,'m²/jam'):'—'}`},'grader');
    addFormula('mgOut',()=>{const V=n('mgV'),Le=n('mgLe'),Lo=n('mgLo'),E=n('mgE');const q=V*(Le-Lo)*1000*E;return `Q = V × (Lebar kerja − overlap) × 1000 × E<br>Q = ${f(V)} × (${f(Le)} − ${f(Lo)}) × 1000 × ${f(E)} = ${fmtUnit(q,'m²/jam')}`},'motor-grader');
    addFormula('mgTimeOut',()=>{const W=n('mgW'),Le=n('mgLe2'),Lo=n('mgLo2'),np=n('mgNPass'),D=n('mgD'),V=n('mgV2'),E=n('mgE'),width=Le-Lo,trips=width?W/width*np:NaN,h=V&&E?(trips*D)/(V*1000*E):NaN;return `Trip = (Lebar area ÷ lebar efektif) × n<br>Trip = (${f(W)} ÷ (${f(Le)} − ${f(Lo)})) × ${f(np,0)} = ${f(trips)} trip<br>Waktu = (Trip × Distance) ÷ (V × 1000 × E) = ${Number.isFinite(h)?fmtUnit(h,'jam'):'—'}`},'motor-time');
    addFormula('cpOut',()=>{const W=n('cpW'),V=n('cpV'),H=n('cpH'),E=n('cpE'),N=n('cpN'),q=N?(W*V*H*1000*E)/N:NaN;return `Q = (W × V × H × 1000 × E) ÷ N<br>Q = (${f(W)} × ${f(V)} × ${f(H)} × 1000 × ${f(E)}) ÷ ${f(N)} = ${Number.isFinite(q)?fmtUnit(q,'m³/jam'):'—'}`},'compactor');
    addFormula('rdDensityOut',()=>{const TL=n('rdTL'),lane=n('rdLane'),head=n('rdHead'),unit=n('rdUnitLen'),actual=n('rdActual'),hs=head+unit,d=hs?(1000*TL*.8*lane)/hs:NaN;return `Dmax = (1000 × TL × 80% × Lane) ÷ Hs<br>Hs = Head Spacing + panjang unit = ${f(head)} + ${f(unit)} = ${f(hs)} m<br>Dmax = (1000 × ${f(TL)} × 80% × ${f(lane)}) ÷ ${f(hs)} = ${Number.isFinite(d)?fmtUnit(d,'unit'):'—'}<br>Actual = ${f(actual,0)} unit → <b>${Number.isFinite(d)&&actual<=d?'OK — BELOW MAX':'OVER — ABOVE MAX'}</b>`},'road-density');
    const q=$('qsuar2026'); if(q){let box=q.querySelector('[data-formula-box="qsuar"]');if(!box){box=document.createElement('div');box.className='formula-calc';box.dataset.formulaBox='qsuar';q.appendChild(box)}const run=()=>{const cap=n('q26GraderCap'),w=n('q26RoadWidth'),d=n('q26Distance'),g=n('q26Graders')||1;const rate=w?cap/w:0,t=rate&&d?d/(rate*g):NaN;box.innerHTML=`<strong>RUMUS & SUBSTITUSI</strong><br>Kapasitas per lebar = Kapasitas Grader ÷ Lebar Jalan<br>${f(cap,0)} ÷ ${f(w)} = <b>${f(rate)} BCM/jam</b><br>Scrapping Time = Distance ÷ (Capacity per lebar × jumlah grader)<br>${f(d)} ÷ (${f(rate)} × ${f(g,0)}) = ${Number.isFinite(t)?fmtUnit(t,'jam'):'—'}`};q.querySelectorAll('input,select').forEach(x=>{x.addEventListener('input',run);x.addEventListener('change',run)});run()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,300));else setTimeout(install,300);
  new MutationObserver(()=>setTimeout(install,100)).observe(document.documentElement,{childList:true,subtree:true});
})();
