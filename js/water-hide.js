(()=>{
  const hideOldWaterResults=()=>{
    const card=document.querySelector('#water-truck');
    if(!card)return;
    card.querySelectorAll('.card-body > .result-line').forEach(row=>{
      const text=(row.textContent||'').toUpperCase();
      if(text.includes('KEBUTUHAN WATER TRUCK')||text.includes('KEBUTUHAN AIR RUTE')) row.style.display='none';
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hideOldWaterResults);
  hideOldWaterResults();
  new MutationObserver(hideOldWaterResults).observe(document.documentElement,{childList:true,subtree:true});
})();