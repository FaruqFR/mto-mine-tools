(()=>{
  const $=id=>document.getElementById(id);
  const n=id=>parseFloat($(id)?.value)||0;
  function setupTruckProductivityCTa(){
    const input=$('excCTProd');
    if(!input||input.dataset.ctaFixed==='1')return;
    input.dataset.ctaFixed='1';
    input.removeAttribute('readonly');
    input.disabled=false;
    input.type='number';
    input.min='0.01';
    input.step='0.01';
    const label=input.closest('label');
    const span=label?.querySelector('span');
    if(span)span.textContent='CTa - Cycle Time Alat Angkut (menit)';
    input.value=(n('loading')+n('travelLoaded')+n('maneuverDump')+n('dumping')+n('maneuverEmpty')+n('travelEmpty'))/60;
    input.value=Number(input.value).toFixed(2);
    input.addEventListener('input',()=>{
      input.dataset.manual='1';
      if(typeof window.truckProduction==='function')window.truckProduction();
    });
    if(typeof window.truckProduction==='function')window.truckProduction();
  }
  const originalCycleExc=window.cycleExc;
  if(typeof originalCycleExc==='function'){
    window.cycleExc=function(){
      const input=$('excCTProd');
      const manual=input?.dataset.manual==='1';
      const saved=input?.value;
      const result=originalCycleExc.apply(this,arguments);
      if(input&&manual){input.value=saved;}
      setupTruckProductivityCTa();
      if(typeof window.truckProduction==='function')window.truckProduction();
      return result;
    };
  }
  document.addEventListener('DOMContentLoaded',setupTruckProductivityCTa);
  setupTruckProductivityCTa();
})();