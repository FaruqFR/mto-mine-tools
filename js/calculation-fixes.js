(function(){
  const $=id=>document.getElementById(id);
  const n=id=>{const v=parseFloat($(id)?.value);return Number.isFinite(v)?v:0};
  const fmt=(v,d=2)=>Number(v).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const sumTruck=()=>['loading','travelLoaded','maneuverDump','dumping','maneuverEmpty','travelEmpty'].reduce((s,id)=>s+n(id),0);
  const sumExc=()=>['digging','swingLoaded','dumpingExc','swingEmpty'].reduce((s,id)=>s+n(id),0);

  let mfCtaManual=false, truckCtaManual=false, mfCtmManual=false, excCtmManual=false;
  const markManual=id=>{
    const el=$(id);if(!el)return;
    el.dataset.manual='1';
    if(id==='mfCta')mfCtaManual=true;
    if(id==='excCTProd')truckCtaManual=true;
    if(id==='loadingTimeMF')mfCtmManual=true;
    if(id==='truckCTSec')excCtmManual=true;
  };

  function refreshLabels(){
    const set=(id,text)=>{const el=$(id);const s=el?.closest('label')?.querySelector('span');if(s)s.innerHTML=text};
    set('loadingTimeMF','CTm - Waktu Muat Total <small>(menit)</small>');
    set('mfCta','CTa - Cycle Time Alat Angkut <small>(menit)</small>');
    set('excCTProd','CTa - Cycle Time Alat Angkut <small>(menit)</small>');
    set('truckCTSec','CTm - Cycle Time Alat Muat <small>(menit)</small>');

    const mf=document.querySelector('#match-factor .formula-display');
    if(mf)mf.innerHTML='MF = <span>Na × CTm</span><hr><span>Nm × CTa</span><small style="display:block;margin-top:8px">CTm dan CTa dalam menit</small>';

    const haul=document.querySelector('#produktivit-as .formula-display');
    if(haul)haul.innerHTML='Produksi = <span>60</span> / <span>CTa</span> × n × q × FF × SF × E<small style="display:block;margin-top:8px">CTa dalam menit</small>';
  }

  window.matchFactor=function(){
    const Na=n('numTruck'),Nm=n('numExc'),CTm=n('loadingTimeMF'),CTa=n('mfCta');
    const mf=(Nm>0&&CTa>0)?(Na*CTm)/(Nm*CTa):NaN;
    if($('mfValue'))$('mfValue').textContent=Number.isFinite(mf)?fmt(mf):'—';
    const b=$('mfStatusBadge'),t=$('mfStatusText');
    if(b&&t){
      if(!Number.isFinite(mf)){b.textContent='DATA';t.textContent='Data belum valid'}
      else if(mf<.98){b.textContent='MF < 1';t.textContent='Alat angkut bekerja penuh; alat muat cenderung menunggu'}
      else if(mf<=1.02){b.textContent='MF = 1';t.textContent='Alat muat dan alat angkut serasi'}
      else{b.textContent='MF > 1';t.textContent='Alat muat bekerja penuh; alat angkut cenderung antre'}
    }
  };

  // No. 4 — Produktivitas Alat Angkut (Dump Truck)
  // EXACT formula requested by user:
  // Produksi = (60 / CTa) × n × q × FF × SF × E
  window.truckProduction=function(){
    const CTa=n('excCTProd');
    const passes=n('prodPass');
    const q=n('bucketCap');
    const FF=n('fillFactor');
    const SF=n('swellFactor');
    const E=n('effTruck')/100;
    const p=CTa>0?(60/CTa)*passes*q*FF*SF*E:NaN;
    if($('truckProdOutput'))$('truckProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  // No. 5 — Produktivitas Excavator / Loader
  // Produksi = (60 / CTm) × q × FF × SF × E
  window.excavatorProduction=function(){
    const CTm=n('truckCTSec'),q=n('bucketCap2'),FF=n('fillFactor2'),SF=n('swellFactor'),E=n('effExc')/100;
    const p=CTm>0?(60/CTm)*q*FF*SF*E:NaN;
    if($('excProdOutput'))$('excProdOutput').textContent=Number.isFinite(p)?fmt(p):'—';
  };

  function makeEditable(id,handler){
    const el=$(id);if(!el)return;
    el.removeAttribute('readonly');
    el.removeAttribute('disabled');
    el.style.pointerEvents='auto';
    el.style.backgroundColor='white';
    el.addEventListener('focus',()=>markManual(id));
    el.addEventListener('input',()=>{markManual(id);handler&&handler();});
    el.addEventListener('change',()=>{markManual(id);handler&&handler();});
  }

  function install(){
    refreshLabels();
    makeEditable('mfCta',window.matchFactor);
    makeEditable('loadingTimeMF',window.matchFactor);
    makeEditable('excCTProd',window.truckProduction);
    makeEditable('truckCTSec',window.excavatorProduction);

    if(!window.__mtoEditableCTInstalled){
      const originalTruck=window.cycleTruck;
      const originalExc=window.cycleExc;
      window.cycleTruck=function(){
        const savedMF=$('mfCta')?.value;
        const savedTruck=$('truckCTSec')?.value;
        const r=typeof originalTruck==='function'?originalTruck():sumTruck();
        if(mfCtaManual&&$('mfCta'))$('mfCta').value=savedMF;
        if(excCtmManual&&$('truckCTSec'))$('truckCTSec').value=savedTruck;
        return r;
      };
      window.cycleExc=function(){
        const saved=$('excCTProd')?.value;
        const r=typeof originalExc==='function'?originalExc():sumExc();
        if(truckCtaManual&&$('excCTProd'))$('excCTProd').value=saved;
        return r;
      };
      window.__mtoEditableCTInstalled=true;
    }

    if($('mfCta')&&!mfCtaManual&&!$('mfCta').value)$('mfCta').value=(sumTruck()/60).toFixed(2);
    if($('excCTProd')&&!truckCtaManual&&!$('excCTProd').value)$('excCTProd').value=(sumTruck()/60).toFixed(2);
    if($('loadingTimeMF')&&!mfCtmManual&&!$('loadingTimeMF').value)$('loadingTimeMF').value=(sumExc()/60).toFixed(3);
    if($('truckCTSec')&&!excCtmManual&&!$('truckCTSec').value)$('truckCTSec').value=(sumExc()/60).toFixed(3);

    window.matchFactor();
    window.truckProduction();
    window.excavatorProduction();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,50));
  else setTimeout(install,50);
  const observer=new MutationObserver(()=>setTimeout(install,0));
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();