(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const v=parseFloat($(id)?.value);return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  let mfManual=false, haulManual=false, excManual=false;
  const editable=id=>{const e=$(id);if(!e)return;e.removeAttribute('readonly');e.removeAttribute('disabled');e.style.pointerEvents='auto';e.addEventListener('input',()=>{if(id==='mfCta')mfManual=true;if(id==='excCTProd')haulManual=true;if(id==='truckCTSec')excManual=true;});e.addEventListener('change',()=>{if(id==='mfCta')mfManual=true;if(id==='excCTProd')haulManual=true;if(id==='truckCTSec')excManual=true;});};
  function labels(){
    const set=(id,t)=>{const s=$(id)?.closest('label')?.querySelector('span');if(s)s.innerHTML=t};
    set('loadingTimeMF','tm / CTm - Waktu muat total <small>(menit)</small>');
    set('mfCta','ta / CTa - Cycle Time alat angkut <small>(menit)</small>');
    set('excCTProd','CTa - Cycle Time alat angkut <small>(menit)</small>');
    set('bucketCap','q - Kapasitas muatan nominal <small>(m³)</small>');
    set('fillFactor','K - Faktor bucket / fill factor');
    set('swellFactor','SF - Swell factor <small>(tidak dipakai pada rumus referensi)</small>');
    set('effTruck','E - Efisiensi kerja alat <small>(%)</small>');
    set('truckCTSec','CTm - Cycle Time alat muat <small>(menit)</small>');
    set('bucketCap2','q - Kapasitas bucket nominal <small>(m³)</small>');
    set('fillFactor2','K - Faktor bucket / fill factor');
    set('effExc','E - Efisiensi kerja alat <small>(%)</small>');
    const mf=document.querySelector('#match-factor .formula-display');
    if(mf)mf.innerHTML='<div>MF =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>Na × tm</span><hr style="margin:3px 0"><span>Nm × ta</span></div>';
    const haul=document.querySelector('#produktivit-as .formula-display');
    if(haul)haul.innerHTML='<div>Produksi =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>q × K × 60 × E</span><hr style="margin:3px 0"><span>CTa</span></div><small style="display:block;margin-top:8px">Jika CTa dalam menit</small><div style="margin-top:8px">atau dengan konversi detik: &nbsp; Produksi = q × K × 3000 × E / CTa</div>';
    const exc=document.querySelector('#produktivitas-exc .formula-display');
    if(exc)exc.innerHTML='<div>Produksi =</div><div style="display:inline-block;text-align:center;line-height:1.25"><span>q × K × 60 × E</span><hr style="margin:3px 0"><span>CTm</span></div><small style="display:block;margin-top:8px">Jika CTm dalam menit</small><div style="margin-top:8px">atau dengan konversi detik: &nbsp; Produksi = q × K × 3000 × E / CTm</div>';
    // The reference formulas do not use pass count or swell factor; hide those legacy controls.
    const hide=id=>{const e=$(id);const l=e?.closest('label');if(l)l.style.display='none'};
    hide('passes');hide('swellFactor');hide('prodPass');
  }
  window.matchFactor=function(){const Na=n('numTruck'),Nm=n('numExc'),tm=n('loadingTimeMF'),ta=n('mfCta');const v=(Nm>0&&ta>0)?Na*tm/(Nm*ta):NaN;if($('mfValue'))$('mfValue').textContent=Number.isFinite(v)?fmt(v):'—';const b=$('mfStatusBadge'),t=$('mfStatusText');if(b&&t){if(!Number.isFinite(v)){b.textContent='DATA';t.textContent='Data belum valid'}else if(v<1){b.textContent='MF < 1';t.textContent='Alat angkut bekerja 100%; alat muat memiliki waktu tunggu'}else if(v===1){b.textContent='MF = 1';t.textContent='Alat muat dan alat angkut bekerja seimbang'}else{b.textContent='MF > 1';t.textContent='Alat muat bekerja 100%; alat angkut mengalami antrean'}}};
  window.truckProduction=function(){const c=n('excCTProd'),q=n('bucketCap'),K=n('fillFactor'),E=n('effTruck')/100;const v=c>0?(q*K*60*E)/c:NaN;if($('truckProdOutput'))$('truckProdOutput').textContent=Number.isFinite(v)?fmt(v):'—'};
  window.excavatorProduction=function(){const c=n('truckCTSec'),q=n('bucketCap2'),K=n('fillFactor2'),E=n('effExc')/100;const v=c>0?(q*K*60*E)/c:NaN;if($('excProdOutput'))$('excProdOutput').textContent=Number.isFinite(v)?fmt(v):'—'};
  function install(){labels();editable('mfCta');editable('excCTProd');editable('truckCTSec');editable('loadingTimeMF');
    if($('mfCta')&&!mfManual&&$('mfCta').value==='955')$('mfCta').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    if($('excCTProd')&&!haulManual&&$('excCTProd').value==='15.91')$('excCTProd').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    if($('truckCTSec')&&!excManual&&$('truckCTSec').value==='955')$('truckCTSec').value=(['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0)/60).toFixed(2);
    window.matchFactor();window.truckProduction();window.excavatorProduction();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,100));else setTimeout(install,100);
  const obs=new MutationObserver(()=>setTimeout(install,20));obs.observe(document.documentElement,{childList:true,subtree:true});
  ['input','change'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target?.id==='mfCta')window.matchFactor();if(['excCTProd','bucketCap','fillFactor','effTruck'].includes(e.target?.id))window.truckProduction();if(['truckCTSec','bucketCap2','fillFactor2','effExc'].includes(e.target?.id))window.excavatorProduction();},true));
})();