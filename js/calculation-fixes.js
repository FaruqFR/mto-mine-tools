(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const v=parseFloat($(id)?.value);return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const truckCTmin=()=>((typeof cycleTruck==='function'?cycleTruck():['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0))/60);
  const excCTmin=()=>((typeof cycleExc==='function'?cycleExc():['digging','swingLoaded','dumpingExc','swingEmpty'].reduce((s,id)=>s+n(id),0))/60);

  // 1) MATCH FACTOR
  // MF = Na x tm / (Nm x ta), with tm = n x CTm and CTm/CTa in minutes.
  window.matchFactor=function(){
    const Na=n('numTruck'), Nm=n('numExc'), CTm=n('loadingTimeMF')||excCTmin(), CTa=truckCTmin(), passes=n('passes');
    const tm=passes*CTm;
    const mf=(Nm>0&&CTa>0)?(Na*tm)/(Nm*CTa):NaN;
    if($('mfValue'))$('mfValue').textContent=Number.isFinite(mf)?fmt(mf):'—';
    if($('mfCta'))$('mfCta').value=CTa.toFixed(2);
    const b=$('mfStatusBadge'),t=$('mfStatusText');
    if(b&&t){
      if(!Number.isFinite(mf)){b.textContent='DATA';t.textContent='Data belum valid'}
      else if(Math.abs(mf-1)<0.02){b.textContent='MF = 1';t.textContent='Alat muat dan alat angkut serasi'}
      else if(mf<1){b.textContent='MF < 1';t.textContent='Alat angkut bekerja penuh; alat muat cenderung menunggu'}
      else{b.textContent='MF > 1';t.textContent='Alat muat bekerja penuh; alat angkut cenderung antre'}
    }
  };

  // 2) PRODUKTIVITAS ALAT ANGKUT
  // Q = (60 / CTa) x n x q x FF x SF x E
  window.truckProduction=function(){
    const CTa=n('excCTProd'), q=n('prodPass')*n('bucketCap'), FF=n('fillFactor'), SF=n('swellFactor'), E=n('effTruck')/100;
    const p=CTa>0?(60/CTa)*q*FF*SF*E:NaN;
    if($('truckProdOutput'))$('truckProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  // 3) PRODUKTIVITAS ALAT MUAT / EXCAVATOR
  // P = (60 / CTm) x q x FF x SF x E
  window.excavatorProduction=function(){
    const CTm=n('truckCTSec'), q=n('bucketCap2'), FF=n('fillFactor2'), SF=n('swellFactor'), E=n('effExc')/100;
    const p=CTm>0?(60/CTm)*q*FF*SF*E:NaN;
    if($('excProdOutput'))$('excProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  function labels(){
    const lm=$('loadingTimeMF')?.closest('label')?.querySelector('span');
    if(lm)lm.innerHTML='CTm - Cycle Time Alat Muat <small>(menit)</small>';
    const mc=$('mfCta')?.closest('label')?.querySelector('span');
    if(mc)mc.innerHTML='CTa - Cycle Time Alat Angkut <small>(menit)</small>';
    const tf=$('excCTProd')?.closest('label')?.querySelector('span');
    if(tf)tf.innerHTML='CTa - Cycle Time Alat Angkut <small>(menit)</small>';
    const ef=$('truckCTSec')?.closest('label')?.querySelector('span');
    if(ef)ef.innerHTML='CTm - Cycle Time Alat Muat <small>(menit)</small>';
    const mfFormula=document.querySelector('#match-factor .formula-display');
    if(mfFormula)mfFormula.innerHTML='MF = <span>Na × (n × CTm)</span><hr><span>Nm × CTa</span><small style="display:block;margin-top:8px">tm = n × CTm &nbsp; | &nbsp; CTm dan CTa dalam menit</small>';
    const trFormula=document.querySelector('#produktivit-as .formula-display');
    if(trFormula)trFormula.textContent='Q = (60 / CTa) × (n × q × FF × SF) × E';
    const exFormula=document.querySelector('#produktivitas-exc .formula-display');
    if(exFormula)exFormula.innerHTML='P = (60 / CTm) × q × FF × SF × E';
  }

  function sync(){
    const cm=truckCTmin(), em=excCTmin();
    if($('mfCta')&&document.activeElement!==$('mfCta'))$('mfCta').value=cm.toFixed(2);
    if($('loadingTimeMF')&&document.activeElement!==$('loadingTimeMF')&&$('loadingTimeMF').dataset.autoset!=='0')$('loadingTimeMF').value=em.toFixed(3);
    if($('excCTProd')&&document.activeElement!==$('excCTProd')&&$('excCTProd').dataset.autoset!=='0')$('excCTProd').value=cm.toFixed(2);
    if($('truckCTSec')&&document.activeElement!==$('truckCTSec')&&$('truckCTSec').dataset.autoset!=='0')$('truckCTSec').value=em.toFixed(3);
    matchFactor();truckProduction();excavatorProduction();
  }

  function unlock(){
    ['excCTProd','truckCTSec','loadingTimeMF'].forEach(id=>{
      const el=$(id);if(!el)return;
      el.removeAttribute('readonly');
      el.dataset.autoset='1';
      el.addEventListener('focus',()=>el.dataset.autoset='0');
      el.addEventListener('input',()=>{
        if(id==='loadingTimeMF')matchFactor();
        if(id==='excCTProd')truckProduction();
        if(id==='truckCTSec')excavatorProduction();
      });
    });
    labels();
    document.querySelectorAll('#core-productivity input').forEach(el=>el.addEventListener('input',()=>{matchFactor();truckProduction();excavatorProduction()}));
    ['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty','digging','swingLoaded','dumpingExc','swingEmpty'].forEach(id=>$(id)?.addEventListener('input',sync));
    sync();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',unlock);else unlock();
})();