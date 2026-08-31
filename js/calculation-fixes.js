(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const v=parseFloat($(id)?.value);return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  let mfManual=false, haulManual=false, excManual=false;
  const editable=id=>{const e=$(id);if(!e)return;e.removeAttribute('readonly');e.removeAttribute('disabled');e.style.pointerEvents='auto';e.addEventListener('input',()=>{if(id==='mfCta')mfManual=true;if(id==='excCTProd')haulManual=true;if(id==='truckCTSec')excManual=true;});e.addEventListener('change',()=>{if(id==='mfCta')mfManual=true;if(id==='excCTProd')haulManual=true;if(id==='truckCTSec')excManual=true;});};
  function labels(){
    const set=(id,t)=>{const s=$(id)?.closest('label')?.querySelector('span');if(s)s.innerHTML=t};
    set('loadingTimeMF','tm - Cycle Time Muat Excavator <small>(menit/pass)</small>');
    set('passes','n - Jumlah Pass / Ritase <small>(kali)</small>');
    set('mfCta','ta / CTa - Cycle Time Hauler <small>(menit)</small>');
    set('excCTProd','CTa - Cycle Time Hauler <small>(menit)</small>');
    set('bucketCap','q - Kapasitas muatan nominal <small>(m³)</small>');
    set('fillFactor','FF - Fill Factor');
    set('swellFactor','SF - Swell Factor');
    set('effTruck','E - Efisiensi kerja alat <small>(%)</small>');
    set('truckCTSec','CTm - Cycle Time alat muat <small>(menit)</small>');
    set('bucketCap2','q - Kapasitas bucket nominal <small>(m³)</small>');
    set('fillFactor2','FF - Fill Factor');
    set('effExc','E - Efisiensi kerja alat <small>(%)</small>');
    const mf=document.querySelector('#match-factor .formula-display');
    if(mf)mf.innerHTML='<div>MF =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>Na × tm × n</span><hr style="margin:3px 0"><span>Nm × ta</span></div><small style="display:block;margin-top:8px">tm = cycle time muat excavator per pass · n = jumlah pass · ta = CTa hauler</small>';
    const haul=document.querySelector('#produktivit-as .formula-display');
    if(haul)haul.innerHTML='<div>Q =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>60 × n × q × FF × SF × E</span><hr style="margin:3px 0"><span>CTa</span></div><small id="haulFormulaCalc" style="display:block;margin-top:8px">Substitusi: —</small><small style="display:block;margin-top:4px">n = jumlah ritase/pengisian · CTa dalam menit</small>';
    const exc=document.querySelector('#produktivitas-exc .formula-display');
    if(exc)exc.innerHTML='<div>Produksi =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>60</span><hr style="margin:3px 0"><span>CTm</span></div><span> × q × FF × SF × E</span><small style="display:block;margin-top:8px">CTm dalam menit</small>';
    const show=id=>{const e=$(id);const l=e?.closest('label');if(l)l.style.display=''};
    show('passes');show('swellFactor');
    const hide=id=>{const e=$(id);const l=e?.closest('label');if(l)l.style.display='none'};
    hide('prodPass');
    updateHaulFormula();
  }
  function updateHaulFormula(){
    const c=n('excCTProd'),q=n('bucketCap'),FF=n('fillFactor'),SF=n('swellFactor'),E=n('effTruck')/100,rit=n('passes');
    const v=c>0?(60/c)*rit*q*FF*SF*E:NaN;
    const el=$('haulFormulaCalc');
    if(el)el.textContent=Number.isFinite(v)?`Substitusi: (60 × ${fmt(rit)} × ${fmt(q)} × ${fmt(FF)} × ${fmt(SF)} × ${fmt(E)}) ÷ ${fmt(c)} = ${fmt(v)} m³/jam`:'Substitusi: —';
  }
  window.matchFactor=function(){const Na=n('numTruck'),Nm=n('numExc'),tm=n('loadingTimeMF'),passes=n('passes'),ta=n('mfCta');const v=(Nm>0&&ta>0)?Na*tm*passes/(Nm*ta):NaN;if($('mfValue'))$('mfValue').textContent=Number.isFinite(v)?fmt(v):'—';const b=$('mfStatusBadge'),t=$('mfStatusText');if(b&&t){if(!Number.isFinite(v)){b.textContent='DATA';t.textContent='Data belum valid'}else if(v<1){b.textContent='MF < 1';t.textContent='Alat angkut bekerja 100%; alat muat memiliki waktu tunggu'}else if(v===1){b.textContent='MF = 1';t.textContent='Alat muat dan alat angkut bekerja seimbang'}else{b.textContent='MF > 1';t.textContent='Alat muat bekerja 100%; alat angkut mengalami antrean'}}};
  window.truckProduction=function(){const c=n('excCTProd'),q=n('bucketCap'),FF=n('fillFactor'),SF=n('swellFactor'),E=n('effTruck')/100,rit=n('passes');const v=c>0?(60/c)*rit*q*FF*SF*E:NaN;if($('truckProdOutput'))$('truckProdOutput').textContent=Number.isFinite(v)?fmt(v):'—';updateHaulFormula()};
  window.excavatorProduction=function(){const c=n('truckCTSec'),q=n('bucketCap2'),FF=n('fillFactor2'),SF=n('swellFactor'),E=n('effExc')/100;const v=c>0?(60/c)*q*FF*SF*E:NaN;if($('excProdOutput'))$('excProdOutput').textContent=Number.isFinite(v)?fmt(v):'—'};
  function install(){labels();editable('mfCta');editable('excCTProd');editable('truckCTSec');editable('loadingTimeMF');editable('passes');
    if($('mfCta')&&!mfManual&&$('mfCta').value==='955')$('mfCta').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    if($('excCTProd')&&!haulManual&&$('excCTProd').value==='15.91')$('excCTProd').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    if($('truckCTSec')&&!excManual&&$('truckCTSec').value==='955')$('truckCTSec').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    window.matchFactor();window.truckProduction();window.excavatorProduction();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,100));else setTimeout(install,100);
  const obs=new MutationObserver(()=>setTimeout(install,20));obs.observe(document.documentElement,{childList:true,subtree:true});
  ['input','change'].forEach(ev=>document.addEventListener(ev,e=>{if(['mfCta','loadingTimeMF','passes'].includes(e.target?.id))window.matchFactor();if(['excCTProd','bucketCap','fillFactor','swellFactor','effTruck','passes'].includes(e.target?.id))window.truckProduction();if(['truckCTSec','bucketCap2','fillFactor2','swellFactor','effExc'].includes(e.target?.id))window.excavatorProduction();},true));
})();