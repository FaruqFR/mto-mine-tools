(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const v=parseFloat($(id)?.value);return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const truckCTmin=()=>((typeof cycleTruck==='function'?cycleTruck():['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0))/60);
  const excCTmin=()=>((typeof cycleExc==='function'?cycleExc():['digging','swingLoaded','dumpingExc','swingEmpty'].reduce((s,id)=>s+n(id),0))/60);

  // MATCH FACTOR: MF = (Na x CTm) / (Nm x CTa), with CTm and CTa editable in minutes.
  window.matchFactor=function(){
    const Na=n('numTruck'), Nm=n('numExc'), CTm=n('loadingTimeMF'), CTa=n('mfCta');
    const mf=(Nm>0&&CTa>0)?(Na*CTm)/(Nm*CTa):NaN;
    if($('mfValue'))$('mfValue').textContent=Number.isFinite(mf)?fmt(mf):'—';
    const b=$('mfStatusBadge'),t=$('mfStatusText');
    if(b&&t){
      if(!Number.isFinite(mf)){b.textContent='DATA';t.textContent='Data belum valid'}
      else if(Math.abs(mf-1)<0.02){b.textContent='MF = 1';t.textContent='Alat muat dan alat angkut serasi'}
      else if(mf<1){b.textContent='MF < 1';t.textContent='Alat angkut bekerja penuh; alat muat cenderung menunggu'}
      else{b.textContent='MF > 1';t.textContent='Alat muat bekerja penuh; alat angkut cenderung antre'}
    }
  };

  // PRODUKTIVITAS ALAT ANGKUT: Q = (60 / CTa) x n x q x FF x SF x E.
  window.truckProduction=function(){
    const CTa=n('excCTProd'), q=n('prodPass')*n('bucketCap'), FF=n('fillFactor'), SF=n('swellFactor'), E=n('effTruck')/100;
    const p=CTa>0?(60/CTa)*q*FF*SF*E:NaN;
    if($('truckProdOutput'))$('truckProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  // PRODUKTIVITAS EXCAVATOR: P = (60 / CTm) x q x FF x SF x E. CTm editable.
  window.excavatorProduction=function(){
    const CTm=n('truckCTSec'), q=n('bucketCap2'), FF=n('fillFactor2'), SF=n('swellFactor'), E=n('effExc')/100;
    const p=CTm>0?(60/CTm)*q*FF*SF*E:NaN;
    if($('excProdOutput'))$('excProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  function labels(){
    const lm=$('loadingTimeMF')?.closest('label')?.querySelector('span');
    if(lm)lm.innerHTML='CTm - Waktu Muat Total <small>(menit)</small>';
    const mc=$('mfCta')?.closest('label')?.querySelector('span');
    if(mc)mc.innerHTML='CTa - Cycle Time Alat Angkut <small>(menit)</small>';
    const tf=$('excCTProd')?.closest('label')?.querySelector('span');
    if(tf)tf.innerHTML='CTa - Cycle Time Alat Angkut <small>(menit)</small>';
    const ef=$('truckCTSec')?.closest('label')?.querySelector('span');
    if(ef)ef.innerHTML='CTm - Cycle Time Alat Muat <small>(menit)</small>';
    const mfFormula=document.querySelector('#match-factor .formula-display');
    if(mfFormula)mfFormula.innerHTML='MF = <span>Na × CTm</span><hr><span>Nm × CTa</span><small style="display:block;margin-top:8px">CTm dan CTa dalam menit</small>';
    const trFormula=document.querySelector('#produktivit-as .formula-display');
    if(trFormula)trFormula.textContent='Q = (60 / CTa) × (n × q × FF × SF) × E';
    const exFormula=document.querySelector('#produktivitas-exc .formula-display');
    if(exFormula)exFormula.innerHTML='P = (60 / CTm) × q × FF × SF × E';
  }

  function unlock(){
    // Explicitly unlock all CT fields requested by the user.
    ['loadingTimeMF','mfCta','excCTProd','truckCTSec'].forEach(id=>{
      const el=$(id);if(!el)return;
      el.removeAttribute('readonly');
      el.removeAttribute('disabled');
      el.dataset.manual='0';
      el.addEventListener('focus',()=>el.dataset.manual='1');
      el.addEventListener('input',()=>{
        el.dataset.manual='1';
        if(id==='loadingTimeMF'||id==='mfCta')matchFactor();
        if(id==='excCTProd')truckProduction();
        if(id==='truckCTSec')excavatorProduction();
      });
    });
    labels();
    document.querySelectorAll('#core-productivity input').forEach(el=>el.addEventListener('input',()=>{matchFactor();truckProduction();excavatorProduction()}));

    // Update editable CT fields from the Cycle Time module only if the user has not manually changed them.
    ['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty','digging','swingLoaded','dumpingExc','swingEmpty'].forEach(id=>$(id)?.addEventListener('input',()=>{
      const mf=$('mfCta'), ep=$('truckCTSec');
      if(mf && mf.dataset.manual!=='1') mf.value=truckCTmin().toFixed(2);
      if(ep && ep.dataset.manual!=='1') ep.value=excCTmin().toFixed(3);
      matchFactor();truckProduction();excavatorProduction();
    }));

    const mf=$('mfCta'), ep=$('truckCTSec'), mt=$('loadingTimeMF'), at=$('excCTProd');
    if(mf && !mf.value)mf.value=truckCTmin().toFixed(2);
    if(ep && !ep.value)ep.value=excCTmin().toFixed(3);
    if(mt && !mt.value)mt.value=excCTmin().toFixed(3);
    if(at && !at.value)at.value=truckCTmin().toFixed(2);
    matchFactor();truckProduction();excavatorProduction();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',unlock);else unlock();
})();